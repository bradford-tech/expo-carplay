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

    func create(config: [String: Any]? = nil) -> String {
        let template = CPMapTemplate()
        template.mapDelegate = self

        if let config {
            // Navigation bar buttons
            if let leading = config["leadingNavigationBarButtons"] as? [[String: Any]] {
                template.leadingNavigationBarButtons = MapTemplateConverter.buildBarButtons(from: leading)
            }
            if let trailing = config["trailingNavigationBarButtons"] as? [[String: Any]] {
                template.trailingNavigationBarButtons = MapTemplateConverter.buildBarButtons(from: trailing)
            }

            // Map buttons
            if let mapButtons = config["mapButtons"] as? [[String: Any]] {
                template.mapButtons = MapTemplateConverter.buildMapButtons(from: mapButtons)
            }

            // Template properties
            template.automaticallyHidesNavigationBar = config["automaticallyHidesNavigationBar"] as? Bool ?? true
            template.hidesButtonsWithNavigationBar = config["hidesButtonsWithNavigationBar"] as? Bool ?? false
        } else {
            template.automaticallyHidesNavigationBar = true
        }

        return TemplateStore.shared.store(template)
    }

    // MARK: - CPMapTemplateDelegate

    /// Required by iOS 26.4+ — CarPlayTemplateUIHost calls this during
    /// _updateShareButtonVisibility without checking respondsToSelector:.
    /// Returning false prevents the share button from being configured.
    func mapTemplateShouldProvideRouteSharing(_: CPMapTemplate) -> Bool {
        false
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

    func setRoute(segments: [[String: Any]]) {
        mapViewController?.setRoute(segments: segments)
    }

    func clearRoute() {
        mapViewController?.clearRoute()
    }
}
