// SceneSessionManager.swift
// Holds references to the active CPInterfaceController and CPWindow for the current session.
// Provides these to handlers via dependency injection — handlers never access singletons.
// See: docs/carplay-api-surface.md §1 — CPInterfaceController

import CarPlay

final class SceneSessionManager {
  private(set) var interfaceController: CPInterfaceController?
  private(set) var carWindow: CPWindow?
  private(set) var isConnected: Bool = false

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
