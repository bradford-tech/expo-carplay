// CarPlayMapViewController.swift
// UIViewController containing an MKMapView for the CarPlay window's base view.
// Assigned as CPWindow.rootViewController by CarPlaySceneDelegate on connect.
// See: docs/carplay-api-surface.md §2 — Map Template (base view)

import MapKit
import UIKit

class CarPlayMapViewController: UIViewController {
  private let mapView = MKMapView()

  override func viewDidLoad() {
    super.viewDidLoad()
    mapView.showsUserLocation = true
    view.addSubview(mapView)
  }

  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    mapView.frame = view.bounds
  }
}
