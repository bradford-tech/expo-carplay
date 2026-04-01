// MapTemplateHandler.swift
// Creates CPMapTemplate instances and stores them in TemplateStore.
// Serves as CPMapTemplateDelegate (required by iOS 26.4+ to avoid crash in
// CarPlayTemplateUIHost when configuring the navigation bar share button).
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import CarPlay

final class MapTemplateHandler: NSObject, CPMapTemplateDelegate {
  static let shared = MapTemplateHandler()

  private override init() {
    super.init()
  }

  func create() -> String {
    let template = CPMapTemplate()
    template.mapDelegate = self
    return TemplateStore.shared.store(template)
  }
}
