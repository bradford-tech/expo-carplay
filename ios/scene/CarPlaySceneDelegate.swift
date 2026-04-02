// CarPlaySceneDelegate.swift
// Implements CPTemplateApplicationSceneDelegate for navigation apps.
// Owns the CarPlay connection lifecycle: stores state in SceneSessionManager
// and emits onConnect/onDisconnect events to JS.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller

import CarPlay

@objc(CarPlaySceneDelegate)
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
  // Navigation app variant — receives both interface controller and window
  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didConnect interfaceController: CPInterfaceController,
    to window: CPWindow
  ) {
    SceneSessionManager.shared.connect(interfaceController: interfaceController, window: window)
    window.rootViewController = CarPlayMapViewController()
    CarPlayEventEmitter.shared.emit("onConnect")
  }

  func templateApplicationScene(
    _ templateApplicationScene: CPTemplateApplicationScene,
    didDisconnect interfaceController: CPInterfaceController,
    from window: CPWindow
  ) {
    TemplateStore.shared.clear()
    SceneSessionManager.shared.disconnect()
    CarPlayEventEmitter.shared.emit("onDisconnect")
  }
}
