// MapTemplateHandler.swift
// Creates CPMapTemplate instances and stores them in TemplateStore.
// Forwards map control calls to CarPlayMapViewController.
// Init-injected per Phase D1's DI rework (no more *.shared).
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons
//      docs/superpowers/specs/2026-05-16-di-rework-design.md

import CarPlay

final class MapTemplateHandler: NSObject, CPMapTemplateDelegate {
    private let interfaceController: CPInterfaceController
    private let mapViewController: CarPlayMapViewController
    private let navigationHandler: NavigationHandler

    init(
        interfaceController: CPInterfaceController,
        mapViewController: CarPlayMapViewController,
        navigationHandler: NavigationHandler
    ) {
        self.interfaceController = interfaceController
        self.mapViewController = mapViewController
        self.navigationHandler = navigationHandler
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
        if let hex = config.guidanceBackgroundColor {
            template.guidanceBackgroundColor = ColorConverter.color(from: hex)
        }

        return TemplateStore.shared.store(template)
    }

    func updateButtons(config: MapTemplateButtonsConfig) {
        guard let mapTemplate = interfaceController.rootTemplate as? CPMapTemplate else { return }

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

    /// Opt out of route sharing — we don't donate route metadata to the vehicle.
    /// (The iOS 26.4/26.5 share-button crash is handled by ios/shared/CPSCompat.m,
    /// not this method; disassembly shows _updateShareButtonVisibility never
    /// queries the mapDelegate.)
    func mapTemplateShouldProvideRouteSharing(_: CPMapTemplate) -> Bool {
        false
    }

    func mapTemplate(_: CPMapTemplate, selectedPreviewFor trip: CPTrip, using routeChoice: CPRouteChoice) {
        guard let tripIndex = navigationHandler.tripIndex(for: trip) else { return }
        let routeIndex = trip.routeChoices.firstIndex(of: routeChoice) ?? 0
        CarPlayEventEmitter.shared.emit("onTripPreviewSelected", [
            "tripIndex": tripIndex,
            "routeIndex": routeIndex
        ])
    }

    func mapTemplate(_: CPMapTemplate, startedTrip trip: CPTrip, using routeChoice: CPRouteChoice) {
        guard let tripIndex = navigationHandler.tripIndex(for: trip) else { return }
        let routeIndex = trip.routeChoices.firstIndex(of: routeChoice) ?? 0
        CarPlayEventEmitter.shared.emit("onTripStarted", [
            "tripIndex": tripIndex,
            "routeIndex": routeIndex
        ])
    }

    // MARK: - Map VC Forwarding

    func startFollowingUser() {
        mapViewController.startFollowingUser()
    }

    func stopFollowingUser() {
        mapViewController.stopFollowingUser()
    }

    func setRoute(segments: [RouteSegment], edgePadding: EdgePadding?) {
        mapViewController.setRoute(segments: segments, edgePadding: edgePadding)
    }

    func clearRoute() {
        mapViewController.clearRoute()
    }
}
