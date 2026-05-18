// CarPlaySceneDelegate.swift
// Implements CPTemplateApplicationSceneDelegate for navigation apps.
// Owns the CarPlay connection lifecycle: constructs handlers and
// CarPlayMapViewController on connect, populates SceneSession.current,
// tears them down on disconnect.
// See: docs/superpowers/specs/2026-05-16-di-rework-design.md

import CarPlay

@objc(CarPlaySceneDelegate)
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    /// Navigation app variant — receives both interface controller and window.
    func templateApplicationScene(
        _: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController,
        to window: CPWindow
    ) {
        let mapViewController = CarPlayMapViewController()
        window.rootViewController = mapViewController

        // Construction order matters: NavigationHandler must exist before
        // MapTemplateHandler because the latter takes the former as an init
        // dependency. This forms a one-direction DAG (Map → Nav). Bidirectional
        // cross-handler refs would require weak references and explicit
        // two-phase init; surface that case before working around it.
        let navigationHandler = NavigationHandler(interfaceController: interfaceController)
        let mapHandler = MapTemplateHandler(
            interfaceController: interfaceController,
            mapViewController: mapViewController,
            navigationHandler: navigationHandler
        )
        let searchHandler = SearchTemplateHandler()

        SceneSession.current = SceneSession(
            interfaceController: interfaceController,
            window: window,
            mapViewController: mapViewController,
            mapHandler: mapHandler,
            navigationHandler: navigationHandler,
            searchHandler: searchHandler
        )

        CarPlayEventEmitter.shared.emit("onConnect")
    }

    func templateApplicationScene(
        _: CPTemplateApplicationScene,
        didDisconnect _: CPInterfaceController,
        from _: CPWindow
    ) {
        // Order is deliberate: TemplateStore.clear() runs first to release
        // CPTemplate instances (which carry weak delegate refs to handlers).
        // SceneSession.current = nil then deallocates the handlers + view
        // controller into a world where their weak referrers are already
        // gone. Reverse only with reason.
        TemplateStore.shared.clear()
        SceneSession.current = nil
        CarPlayEventEmitter.shared.emit("onDisconnect")
    }
}
