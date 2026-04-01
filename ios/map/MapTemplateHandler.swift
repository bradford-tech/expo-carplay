// MapTemplateHandler.swift
// Creates CPMapTemplate instances and stores them in TemplateStore.
// For now: bare template with no buttons or delegate.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import CarPlay

final class MapTemplateHandler {
  static let shared = MapTemplateHandler()

  private init() {}

  func create() -> String {
    let template = CPMapTemplate()
    return TemplateStore.shared.store(template)
  }
}
