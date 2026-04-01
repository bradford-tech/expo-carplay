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
  }
}
