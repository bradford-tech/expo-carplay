// CarPlaySceneDelegate.swift
// Implements CPTemplateApplicationSceneDelegate for navigation apps.
// Owns the CarPlay connection lifecycle: stores state in SceneSessionManager
// and emits onConnect/onDisconnect events to JS.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller

import CarPlay

@objc(CarPlaySceneDelegate)
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    /// Navigation app variant — receives both interface controller and window
    func templateApplicationScene(
        _: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController,
        to window: CPWindow
    ) {
        SceneSessionManager.shared.connect(interfaceController: interfaceController, window: window)
        window.rootViewController = CarPlayMapViewController()
        CarPlayEventEmitter.shared.emit("onConnect")
    }

    func templateApplicationScene(
        _: CPTemplateApplicationScene,
        didDisconnect _: CPInterfaceController,
        from _: CPWindow
    ) {
        TemplateStore.shared.clear()
        SceneSessionManager.shared.disconnect()
        CarPlayEventEmitter.shared.emit("onDisconnect")
    }
}
