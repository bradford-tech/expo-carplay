// SceneSessionManager.swift
// Holds references to the active CPInterfaceController and CPWindow for the current session.
// Shared instance accessed by CarPlaySceneDelegate (writes) and module functions (reads).
// See: docs/carplay-api-surface.md §1 — CPInterfaceController

import CarPlay

final class SceneSessionManager {
  static let shared = SceneSessionManager()

  private(set) var interfaceController: CPInterfaceController?
  private(set) var carWindow: CPWindow?
  private(set) var isConnected: Bool = false

  private init() {}

  func connect(interfaceController: CPInterfaceController, window: CPWindow) {
    self.interfaceController = interfaceController
    self.carWindow = window
    self.isConnected = true
  }

  func disconnect() {
    self.interfaceController = nil
    self.carWindow = nil
    self.isConnected = false
  }
}
