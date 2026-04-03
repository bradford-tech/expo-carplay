// MapTemplateHandler.swift
// Creates CPMapTemplate instances and stores them in TemplateStore.
// Forwards map control calls to CarPlayMapViewController.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import CarPlay

final class MapTemplateHandler: NSObject, CPMapTemplateDelegate {
  static let shared = MapTemplateHandler()

  private override init() {
    super.init()
  }

  func create() -> String {
    let template = CPMapTemplate()
    template.mapDelegate = self
    template.automaticallyHidesNavigationBar = false

    // Temporary: add a visible map button to confirm the template is rendering
    let zoomInButton = CPMapButton { _ in }
    zoomInButton.image = UIImage(systemName: "plus.magnifyingglass")
    template.mapButtons = [zoomInButton]

    return TemplateStore.shared.store(template)
  }

  // MARK: - Map VC Access

  private var mapViewController: CarPlayMapViewController? {
    SceneSessionManager.shared.carWindow?.rootViewController as? CarPlayMapViewController
  }

  func updateLocation(latitude: Double, longitude: Double, course: Double, speed: Double) {
    mapViewController?.updateLocation(latitude: latitude, longitude: longitude, course: course, speed: speed)
  }

  func setRoute(coordinates: [[String: Double]]) {
    mapViewController?.setRoute(coordinates: coordinates)
  }

  func clearRoute() {
    mapViewController?.clearRoute()
  }
}
