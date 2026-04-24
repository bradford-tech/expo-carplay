// CarPlayMapViewController.swift
// UIViewController containing an MKMapView for the CarPlay window's base view.
// Manages navigation camera (pitch=60, route-derived heading, adaptive smoothing)
// and route polyline display. Ported from react-native-maps patch.
//
// Location tracking is native — CLLocationManager drives the camera directly
// from didUpdateLocations, bypassing the JS bridge for smooth ~1Hz updates.
// JS only calls startFollowingUser/stopFollowingUser and setRoute/clearRoute.
//
// See: docs/carplay-api-surface.md §2 — Map Template (base view)

import CoreLocation
import MapKit
import UIKit

// MARK: - Route Projection Math

private func bearing(from start: CLLocationCoordinate2D, to end: CLLocationCoordinate2D) -> CLLocationDirection {
    let dLon = (end.longitude - start.longitude) * .pi / 180.0
    let lat1 = start.latitude * .pi / 180.0
    let lat2 = end.latitude * .pi / 180.0
    let y = sin(dLon) * cos(lat2)
    let x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon)
    let b = atan2(y, x) * 180.0 / .pi
    return b.truncatingRemainder(dividingBy: 360.0) + (b < 0 ? 360.0 : 0)
}

private func projectPointOntoSegment(_ point: MKMapPoint, _ segStart: MKMapPoint, _ segEnd: MKMapPoint) -> MKMapPoint {
    let dx = segEnd.x - segStart.x
    let dy = segEnd.y - segStart.y
    let lengthSq = dx * dx + dy * dy
    if lengthSq == 0 { return segStart }
    let t = max(0, min(1, ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq))
    return MKMapPoint(x: segStart.x + t * dx, y: segStart.y + t * dy)
}

private struct SnapResult {
    var projectedPoint: MKMapPoint
    var perpDistance: Double
    var segmentIndex: Int
}

private func findClosestSegment(
    userPoint: MKMapPoint,
    polyline: UnsafePointer<MKMapPoint>,
    pointCount: Int,
    fromIndex: Int,
    toIndex: Int
) -> SnapResult {
    var best = SnapResult(projectedPoint: userPoint, perpDistance: .greatestFiniteMagnitude, segmentIndex: -1)
    let from = max(0, fromIndex)
    let to = min(toIndex, pointCount - 2)
    guard from <= to else { return best }

    for i in from ... to {
        let projected = projectPointOntoSegment(userPoint, polyline[i], polyline[i + 1])
        let dist = projected.distance(to: userPoint)
        if dist < best.perpDistance {
            best.perpDistance = dist
            best.projectedPoint = projected
            best.segmentIndex = i
        }
    }
    return best
}

// MARK: - Constants

private let kSnapOffThreshold: CLLocationDistance = 15.0
private let kSnapOnThreshold: CLLocationDistance = 8.0
private let kFullScanMovementThreshold: CLLocationDistance = 50.0
private let kWindowRadius = 10
private let kCameraPitch: CGFloat = 60
private let kCameraDistance: CLLocationDistance = 500
private let kAnimationDuration: TimeInterval = 1.0

// MARK: - CarPlayMapViewController

class CarPlayMapViewController: UIViewController, MKMapViewDelegate, CLLocationManagerDelegate {
    private let mapView = MKMapView()
    private let locationManager = CLLocationManager()

    // Route state
    private var routeMapPoints: UnsafeMutablePointer<MKMapPoint>?
    private var routePointCount: Int = 0
    private var routeActive: Bool = false
    private var lastMatchedIndex: Int = 0
    private var lastMatchedGPS: CLLocationCoordinate2D = kCLLocationCoordinate2DInvalid
    private var lastKnownBearing: CLLocationDirection = 0
    private var routeOverlays: [MKPolyline] = []
    private var overlayColors: [MKPolyline: UIColor] = [:]
    private var routeAnnotations: [MKPointAnnotation] = []

    /// Camera state
    private var isFollowing: Bool = false
    /// When true, the next didUpdate userLocation callback centers the map.
    private var needsInitialCenter: Bool = false

    override func viewDidLoad() {
        super.viewDidLoad()
        mapView.showsUserLocation = true
        mapView.delegate = self
        view.addSubview(mapView)

        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
        locationManager.activityType = .automotiveNavigation
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        mapView.frame = view.bounds
    }

    deinit {
        if let pts = routeMapPoints {
            pts.deallocate()
            routeMapPoints = nil
        }
    }

    // MARK: - Public API

    func startFollowingUser() {
        DispatchQueue.main.async { [self] in
            isFollowing = true
            locationManager.requestWhenInUseAuthorization()
            locationManager.startUpdatingLocation()

            // Center the map on the user when no route is active.
            // userTrackingMode = .follow doesn't reliably center the CarPlay
            // map, so we center explicitly via setRegion — either immediately
            // from the already-known userLocation, or on the next
            // mapView(_:didUpdate:) callback.
            if !routeActive {
                if let location = mapView.userLocation.location {
                    _centerOnUserLocation(location.coordinate)
                } else {
                    needsInitialCenter = true
                }
            }
        }
    }

    func stopFollowingUser() {
        DispatchQueue.main.async { [self] in
            isFollowing = false
            needsInitialCenter = false
            locationManager.stopUpdatingLocation()
        }
    }

    func setRoute(segments: [[String: Any]], edgePadding: [String: Double]? = nil) {
        DispatchQueue.main.async { [self] in
            _setRouteOnMain(segments: segments, edgePadding: edgePadding)
        }
    }

    func clearRoute() {
        DispatchQueue.main.async { [self] in
            _clearRouteOnMain()
        }
    }

    private func _centerOnUserLocation(_ coordinate: CLLocationCoordinate2D) {
        needsInitialCenter = false
        let region = MKCoordinateRegion(
            center: coordinate,
            latitudinalMeters: 1000,
            longitudinalMeters: 1000
        )
        mapView.setRegion(region, animated: true)
    }

    // MARK: - CLLocationManagerDelegate

    func locationManager(_: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard isFollowing, let location = locations.last else { return }
        _updateCamera(coordinate: location.coordinate, course: location.course)
    }

    func locationManager(_: CLLocationManager, didFailWithError _: Error) {
        // Location errors are expected in the simulator — ignore silently
    }

    // MARK: - Camera Update (called from native CLLocationManager, always on main thread)

    private func _updateCamera(coordinate coord: CLLocationCoordinate2D, course: CLLocationDirection) {
        let currentHeading = mapView.camera.heading

        // Determine target heading: route-derived if available, otherwise GPS course
        var targetHeading = course
        if routeActive, let polyline = routeMapPoints, routePointCount > 1 {
            let userPoint = MKMapPoint(coord)
            let windowStart = lastMatchedIndex - kWindowRadius
            let windowEnd = lastMatchedIndex + kWindowRadius
            let snapResult = findClosestSegment(
                userPoint: userPoint,
                polyline: polyline,
                pointCount: routePointCount,
                fromIndex: windowStart,
                toIndex: windowEnd
            )

            if snapResult.segmentIndex >= 0, snapResult.perpDistance < kSnapOffThreshold {
                let idx = snapResult.segmentIndex
                if idx < routePointCount - 1 {
                    let segStart = polyline[idx].coordinate
                    let segEnd = polyline[idx + 1].coordinate
                    targetHeading = bearing(from: segStart, to: segEnd)
                    lastMatchedIndex = idx
                }
            }
        }

        // Adaptive heading smoothing
        var heading = currentHeading
        if targetHeading >= 0 {
            var delta = targetHeading - currentHeading
            if delta > 180 { delta -= 360 }
            if delta < -180 { delta += 360 }
            if abs(delta) > 2.0 {
                let factor = if abs(delta) > 45.0 {
                    1.0
                } else if abs(delta) > 20.0 {
                    0.7
                } else if abs(delta) > 8.0 {
                    0.5
                } else {
                    0.3
                }
                heading = currentHeading + delta * factor
                if heading < 0 { heading += 360 }
                if heading >= 360 { heading -= 360 }
            }
        }

        // Animated camera transition
        let navCamera = MKMapCamera(
            lookingAtCenter: coord,
            fromDistance: kCameraDistance,
            pitch: kCameraPitch,
            heading: heading
        )

        UIView.animate(
            withDuration: kAnimationDuration,
            delay: 0,
            options: [.curveLinear, .beginFromCurrentState],
            animations: {
                self.mapView.camera = navCamera
            }
        )
    }

    // MARK: - Route Management

    private func _setRouteOnMain(segments: [[String: Any]], edgePadding: [String: Double]? = nil) {
        _clearRouteOnMain()

        // Collect all coordinates across all segments for route projection math
        var allCoordinates: [CLLocationCoordinate2D] = []

        for segmentDict in segments {
            guard let coordArray = segmentDict["coordinates"] as? [[String: Any]],
                  coordArray.count >= 2
            else { continue }

            let colorString = segmentDict["color"] as? String ?? ""
            let color = ColorConverter.color(from: colorString)

            var segCoordinates = coordArray.map { coord -> CLLocationCoordinate2D in
                let lat = (coord["latitude"] as? Double) ?? (coord["latitude"] as? NSNumber)?.doubleValue ?? 0
                let lon = (coord["longitude"] as? Double) ?? (coord["longitude"] as? NSNumber)?.doubleValue ?? 0
                return CLLocationCoordinate2D(latitude: lat, longitude: lon)
            }

            let polyline = MKPolyline(coordinates: &segCoordinates, count: segCoordinates.count)
            routeOverlays.append(polyline)
            overlayColors[polyline] = color
            mapView.addOverlay(polyline)

            allCoordinates.append(contentsOf: segCoordinates)
        }

        guard allCoordinates.count >= 2 else { return }

        // Build flat MKMapPoint array for camera heading projection
        routePointCount = allCoordinates.count
        routeMapPoints = .allocate(capacity: routePointCount)
        for (i, coord) in allCoordinates.enumerated() {
            routeMapPoints![i] = MKMapPoint(coord)
        }

        // Activate route-derived heading
        routeActive = true
        lastMatchedIndex = 0
        lastMatchedGPS = kCLLocationCoordinate2DInvalid

        // Initialize bearing from first segment
        if routePointCount >= 2 {
            let start = routeMapPoints![0].coordinate
            let end = routeMapPoints![1].coordinate
            lastKnownBearing = bearing(from: start, to: end)
        }

        // Zoom to fit the route polyline. Padding is configurable from JS —
        // callers can adjust for UI overlays (e.g., route choice panel).
        if !routeOverlays.isEmpty {
            let rect = routeOverlays.reduce(MKMapRect.null) { $0.union($1.boundingMapRect) }
            let padding = UIEdgeInsets(
                top: edgePadding?["top"] ?? 40,
                left: edgePadding?["left"] ?? 40,
                bottom: edgePadding?["bottom"] ?? 40,
                right: edgePadding?["right"] ?? 40
            )
            mapView.setVisibleMapRect(rect, edgePadding: padding, animated: true)
        }

        // Add start/end pins and hide the user location dot during preview
        let startPin = MKPointAnnotation()
        startPin.coordinate = allCoordinates.first!
        startPin.title = "Start"
        let endPin = MKPointAnnotation()
        endPin.coordinate = allCoordinates.last!
        endPin.title = "End"
        routeAnnotations = [startPin, endPin]
        mapView.addAnnotations(routeAnnotations)
        mapView.showsUserLocation = false
    }

    private func _clearRouteOnMain() {
        for overlay in routeOverlays {
            mapView.removeOverlay(overlay)
        }
        routeOverlays.removeAll()
        overlayColors.removeAll()
        mapView.removeAnnotations(routeAnnotations)
        routeAnnotations.removeAll()
        mapView.showsUserLocation = true
        if let pts = routeMapPoints {
            pts.deallocate()
            routeMapPoints = nil
        }
        routePointCount = 0
        routeActive = false
        lastMatchedIndex = 0
        lastMatchedGPS = kCLLocationCoordinate2DInvalid
        lastKnownBearing = 0
    }

    // MARK: - MKMapViewDelegate

    func mapView(_: MKMapView, didUpdate userLocation: MKUserLocation) {
        guard needsInitialCenter, let location = userLocation.location else { return }
        _centerOnUserLocation(location.coordinate)
    }

    func mapView(_: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        // Don't customize the user location dot
        if annotation is MKUserLocation { return nil }

        guard let pointAnnotation = annotation as? MKPointAnnotation else { return nil }

        if pointAnnotation.title == "Start" {
            let view = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: "start")
            view.markerTintColor = .systemGreen
            view.glyphImage = UIImage(systemName: "figure.wave")
            view.displayPriority = .required
            return view
        }

        if pointAnnotation.title == "End" {
            let view = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: "end")
            view.markerTintColor = .systemRed
            view.glyphImage = UIImage(systemName: "mappin")
            view.displayPriority = .required
            return view
        }

        return nil
    }

    func mapView(_: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
        if let polyline = overlay as? MKPolyline {
            let renderer = MKPolylineRenderer(polyline: polyline)
            renderer.strokeColor = overlayColors[polyline] ?? .systemBlue
            renderer.lineWidth = 5
            return renderer
        }
        return MKOverlayRenderer(overlay: overlay)
    }
}
