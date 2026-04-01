// CarPlaySceneDelegate.swift
// Implements CPTemplateApplicationSceneDelegate for navigation apps.
// Owns the CarPlay connection lifecycle: stores state in SceneSessionManager
// and emits onConnect/onDisconnect events to JS.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller

import CarPlay

@objc(CarPlaySceneDelegate)
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
  let sessionManager = SceneSessionManager()

  // Navigation app variant — receives both interface controller and window
  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController,
    to window: CPWindow
  ) {
    sessionManager.connect(interfaceController: interfaceController, window: window)
    CarPlayEventEmitter.shared.emit("onConnect")
  }

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didDisconnect interfaceController: CPInterfaceController,
    from window: CPWindow
  ) {
    sessionManager.disconnect()
    CarPlayEventEmitter.shared.emit("onDisconnect")
  }
}
