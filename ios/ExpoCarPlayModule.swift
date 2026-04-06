// ExpoCarPlayModule.swift
// Expo Module definition — the sole entry point for the JS bridge.
// Contains only Function/AsyncFunction/Events DSL declarations.
// Every function delegates to a feature handler; no business logic lives here.
// See: docs/carplay-api-surface.md for the complete API surface.

import ExpoModulesCore

public class ExpoCarPlayModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoCarPlay")

        OnCreate {
            CarPlayEventEmitter.shared.setModule(self)
        }

        Events(
            "onConnect",
            "onDisconnect"
        )

        AsyncFunction("createMapTemplate") { () -> String in
            return MapTemplateHandler.shared.create()
        }

        AsyncFunction("setRootTemplate") { (templateId: String) in
            guard let template = TemplateStore.shared.get(templateId) else {
                throw NSError(
                    domain: "ExpoCarPlay",
                    code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "Template not found: \(templateId)"]
                )
            }
            guard let interfaceController = SceneSessionManager.shared.interfaceController else {
                throw NSError(
                    domain: "ExpoCarPlay",
                    code: 2,
                    userInfo: [NSLocalizedDescriptionKey: "CarPlay not connected"]
                )
            }
            TemplateStore.shared.clear()
            _ = TemplateStore.shared.store(template)
            interfaceController.setRootTemplate(template, animated: true, completion: nil)
        }

        AsyncFunction("startFollowingUser") { () in
            MapTemplateHandler.shared.startFollowingUser()
        }

        AsyncFunction("stopFollowingUser") { () in
            MapTemplateHandler.shared.stopFollowingUser()
        }

        AsyncFunction("setCarPlayRoute") { (segments: [[String: Any]]) in
            MapTemplateHandler.shared.setRoute(segments: segments)
        }

        AsyncFunction("clearCarPlayRoute") { () in
            MapTemplateHandler.shared.clearRoute()
        }

        AsyncFunction("startNavigation") { (tripConfig: [String: Any]) -> String in
            guard let sessionId = NavigationHandler.shared.startNavigation(tripConfig: tripConfig) else {
                throw NSError(
                    domain: "ExpoCarPlay",
                    code: 3,
                    userInfo: [NSLocalizedDescriptionKey: "Failed to start navigation — invalid trip config or no map template"]
                )
            }
            return sessionId
        }

        AsyncFunction("stopNavigation") { () in
            NavigationHandler.shared.stopNavigation()
        }

        AsyncFunction("updateManeuvers") { (maneuvers: [[String: Any]]) in
            NavigationHandler.shared.updateManeuvers(configs: maneuvers)
        }

        AsyncFunction("updateTravelEstimates") { (estimates: [String: Double], maneuverIndex: Int?) in
            NavigationHandler.shared.updateTravelEstimates(
                distanceRemaining: estimates["distanceRemaining"] ?? 0,
                timeRemaining: estimates["timeRemaining"] ?? 0,
                maneuverIndex: maneuverIndex
            )
        }
    }
}
