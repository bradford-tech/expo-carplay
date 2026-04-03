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
      let _ = TemplateStore.shared.store(template)
      interfaceController.setRootTemplate(template, animated: true, completion: nil)
    }

    AsyncFunction("updateCarPlayLocation") { (location: [String: Double]) in
      MapTemplateHandler.shared.updateLocation(
        latitude: location["latitude"] ?? 0,
        longitude: location["longitude"] ?? 0,
        course: location["course"] ?? -1,
        speed: location["speed"] ?? 0
      )
    }

    AsyncFunction("setCarPlayRoute") { (coordinates: [[String: Double]]) in
      MapTemplateHandler.shared.setRoute(coordinates: coordinates)
    }

    AsyncFunction("clearCarPlayRoute") { () in
      MapTemplateHandler.shared.clearRoute()
    }
  }
}
