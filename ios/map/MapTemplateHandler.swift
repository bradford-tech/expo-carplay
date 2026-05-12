// MapTemplateHandler.swift
// Creates CPMapTemplate instances and stores them in TemplateStore.
// Forwards map control calls to CarPlayMapViewController.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import CarPlay

final class MapTemplateHandler: NSObject, CPMapTemplateDelegate {
    static let shared = MapTemplateHandler()

    override private init() {
        super.init()
    }

    func create(config: MapTemplateConfig?) -> String {
        // Resolve nil to defaults at the boundary so handler logic operates on
        // a real Record. Convention for every typed-Record handler in Phase B+.
        let config = config ?? MapTemplateConfig()

        let template = CPMapTemplate()
        template.mapDelegate = self
        template.leadingNavigationBarButtons = MapTemplateConverter.buildBarButtons(from: config.leadingNavigationBarButtons)
        template.trailingNavigationBarButtons = MapTemplateConverter.buildBarButtons(from: config.trailingNavigationBarButtons)
        template.mapButtons = MapTemplateConverter.buildMapButtons(from: config.mapButtons)
        template.automaticallyHidesNavigationBar = config.automaticallyHidesNavigationBar
        template.hidesButtonsWithNavigationBar = config.hidesButtonsWithNavigationBar

        return TemplateStore.shared.store(template)
    }

    func updateButtons(config: MapTemplateButtonsConfig) {
        guard let interfaceController = SceneSessionManager.shared.interfaceController,
              let mapTemplate = interfaceController.rootTemplate as? CPMapTemplate
        else { return }

        DispatchQueue.main.async {
            // Optional arrays: nil = leave alone, empty = clear that group.
            if let leading = config.leadingNavigationBarButtons {
                mapTemplate.leadingNavigationBarButtons = MapTemplateConverter.buildBarButtons(from: leading)
            }
            if let trailing = config.trailingNavigationBarButtons {
                mapTemplate.trailingNavigationBarButtons = MapTemplateConverter.buildBarButtons(from: trailing)
            }
            if let mapButtons = config.mapButtons {
                mapTemplate.mapButtons = MapTemplateConverter.buildMapButtons(from: mapButtons)
            }
        }
    }

    // MARK: - CPMapTemplateDelegate

    /// Required by iOS 26.4+ — CarPlayTemplateUIHost calls this during
    /// _updateShareButtonVisibility without checking respondsToSelector:.
    /// Returning false prevents the share button from being configured.
    func mapTemplateShouldProvideRouteSharing(_: CPMapTemplate) -> Bool {
        false
    }

    func mapTemplate(_: CPMapTemplate, selectedPreviewFor trip: CPTrip, using routeChoice: CPRouteChoice) {
        guard let tripIndex = NavigationHandler.shared.tripIndex(for: trip) else { return }
        let routeIndex = trip.routeChoices.firstIndex(of: routeChoice) ?? 0
        CarPlayEventEmitter.shared.emit("onTripPreviewSelected", [
            "tripIndex": tripIndex,
            "routeIndex": routeIndex
        ])
    }

    func mapTemplate(_: CPMapTemplate, startedTrip trip: CPTrip, using routeChoice: CPRouteChoice) {
        guard let tripIndex = NavigationHandler.shared.tripIndex(for: trip) else { return }
        let routeIndex = trip.routeChoices.firstIndex(of: routeChoice) ?? 0
        CarPlayEventEmitter.shared.emit("onTripStarted", [
            "tripIndex": tripIndex,
            "routeIndex": routeIndex
        ])
    }

    // MARK: - Map VC Access

    private var mapViewController: CarPlayMapViewController? {
        SceneSessionManager.shared.carWindow?.rootViewController as? CarPlayMapViewController
    }

    func startFollowingUser() {
        mapViewController?.startFollowingUser()
    }

    func stopFollowingUser() {
        mapViewController?.stopFollowingUser()
    }

    func setRoute(segments: [RouteSegment], edgePadding: EdgePadding?) {
        mapViewController?.setRoute(segments: segments, edgePadding: edgePadding)
    }

    func clearRoute() {
        mapViewController?.clearRoute()
    }
}
