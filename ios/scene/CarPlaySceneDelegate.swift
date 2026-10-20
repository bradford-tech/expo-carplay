// CarPlaySceneDelegate.swift
// Implements CPTemplateApplicationSceneDelegate for navigation apps.
// Owns the CarPlay connection lifecycle: makes sure React Native is running
// (CarPlay-first cold launch), constructs handlers and CarPlayMapViewController
// on connect, populates SceneSession.current, tears them down on disconnect.
// See: docs/superpowers/specs/2026-05-16-di-rework-design.md

import CarPlay
import Expo
import React

@objc(CarPlaySceneDelegate)
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    /// Navigation app variant — receives both interface controller and window.
    func templateApplicationScene(
        _: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController,
        to window: CPWindow
    ) {
        ensureReactNativeStarted()

        let mapViewController = CarPlayMapViewController()
        window.rootViewController = mapViewController

        // One store per scene: templates must not outlive the scene that
        // created them, and must not be visible from a later scene either.
        let templateStore = TemplateStore()

        // Construction order matters: NavigationHandler must exist before
        // MapTemplateHandler because the latter takes the former as an init
        // dependency. This forms a one-direction DAG (Map → Nav, Map → Store,
        // Search → Store). Bidirectional cross-handler refs would require weak
        // references and explicit two-phase init; surface that case before
        // working around it.
        let navigationHandler = NavigationHandler(interfaceController: interfaceController)
        let mapHandler = MapTemplateHandler(
            interfaceController: interfaceController,
            mapViewController: mapViewController,
            navigationHandler: navigationHandler,
            templateStore: templateStore
        )
        let searchHandler = SearchTemplateHandler(templateStore: templateStore)

        SceneSession.current = SceneSession(
            interfaceController: interfaceController,
            window: window,
            mapViewController: mapViewController,
            templateStore: templateStore,
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
        // Dropping the session releases the templates, handlers, and view
        // controller together. Template delegate refs are weak (zeroing), so
        // no release order is required between them. With the store inside
        // the session, an AsyncFunction can never observe a live session
        // whose templates are already gone.
        SceneSession.current = nil
        CarPlayEventEmitter.shared.emit("onDisconnect")
    }

    /// CarPlay-first cold launch: only the CarPlay scene connects, so Expo's
    /// phone-scene delegate (which creates the window and starts React Native)
    /// never runs. Start React Native into a scene-less placeholder window; the
    /// generated PhoneSceneDelegate adopts it when the phone scene connects.
    /// Storing the window on the provider also satisfies expo-updates'
    /// getWindow() fallback (expo/expo#50870).
    private func ensureReactNativeStarted() {
        guard let provider = UIApplication.shared.delegate as? ExpoReactNativeFactoryProvider,
              provider.window == nil,
              let factory = provider.reactNativeFactory
        else { return }
        let placeholder = UIWindow(frame: UIScreen.main.bounds)
        provider.window = placeholder
        factory.startReactNative(
            withModuleName: provider.reactNativeFactoryModuleName,
            in: placeholder,
            launchOptions: nil
        )
    }
}
