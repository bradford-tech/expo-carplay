// CarPlayMapViewController.swift
// UIViewController containing an MKMapView for the CarPlay window's base view.
// Manages navigation camera (pitch=60, route-derived heading, adaptive smoothing)
// and route polyline display. Ported from react-native-maps patch.
// See: docs/carplay-api-surface.md §2 — Map Template (base view)

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

  for i in from...to {
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

class CarPlayMapViewController: UIViewController, MKMapViewDelegate {
  private let mapView = MKMapView()

  // Route state
  private var routeMapPoints: UnsafeMutablePointer<MKMapPoint>?
  private var routePointCount: Int = 0
  private var routeActive: Bool = false
  private var lastMatchedIndex: Int = 0
  private var lastMatchedGPS: CLLocationCoordinate2D = kCLLocationCoordinate2DInvalid
  private var lastKnownBearing: CLLocationDirection = 0
  private var routeOverlay: MKPolyline?

  // Camera state
  private var isFollowing: Bool = false

  override func viewDidLoad() {
    super.viewDidLoad()
    mapView.showsUserLocation = true
    mapView.delegate = self
    view.addSubview(mapView)
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

  func updateLocation(latitude: Double, longitude: Double, course: Double, speed: Double) {
    let coord = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
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
        let factor: Double
        if abs(delta) > 45.0 {
          factor = 1.0
        } else if abs(delta) > 20.0 {
          factor = 0.7
        } else if abs(delta) > 8.0 {
          factor = 0.5
        } else {
          factor = 0.3
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

    isFollowing = true
    UIView.animate(
      withDuration: kAnimationDuration,
      delay: 0,
      options: [.curveLinear, .beginFromCurrentState],
      animations: {
        self.mapView.camera = navCamera
      }
    )
  }

  func setRoute(coordinates: [[String: Double]]) {
    // Free previous route
    clearRoute()

    guard coordinates.count >= 2 else { return }

    // Parse into MKMapPoint array
    routePointCount = coordinates.count
    routeMapPoints = .allocate(capacity: routePointCount)
    for (i, coord) in coordinates.enumerated() {
      let lat = coord["latitude"] ?? 0
      let lon = coord["longitude"] ?? 0
      routeMapPoints![i] = MKMapPoint(CLLocationCoordinate2D(latitude: lat, longitude: lon))
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

    // Add polyline overlay
    var mapCoordinates = coordinates.map { coord -> CLLocationCoordinate2D in
      CLLocationCoordinate2D(
        latitude: coord["latitude"] ?? 0,
        longitude: coord["longitude"] ?? 0
      )
    }
    let polyline = MKPolyline(coordinates: &mapCoordinates, count: mapCoordinates.count)
    routeOverlay = polyline
    mapView.addOverlay(polyline)
  }

  func clearRoute() {
    if let overlay = routeOverlay {
      mapView.removeOverlay(overlay)
      routeOverlay = nil
    }
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

  func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
    if let polyline = overlay as? MKPolyline {
      let renderer = MKPolylineRenderer(polyline: polyline)
      renderer.strokeColor = .systemBlue
      renderer.lineWidth = 5
      return renderer
    }
    return MKOverlayRenderer(overlay: overlay)
  }
}
