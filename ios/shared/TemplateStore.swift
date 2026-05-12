// TemplateStore.swift
// Cross-cutting registry mapping JS string IDs to native CPTemplate instances.
//
// Lifecycle: templates live for the duration of a CarPlay session and are
// freed in bulk when the scene disconnects. A typical session has at most a
// few dozen templates, so per-template GC is unnecessary; clearing on
// disconnect is the only required cleanup.

import CarPlay
import Foundation

final class TemplateStore {
    static let shared = TemplateStore()

    private var templates: [String: CPTemplate] = [:]

    private init() {}

    func store(_ template: CPTemplate) -> String {
        let id = UUID().uuidString
        templates[id] = template
        return id
    }

    func get(_ id: String) -> CPTemplate? {
        templates[id]
    }

    func remove(_ id: String) {
        templates.removeValue(forKey: id)
    }

    func clear() {
        templates.removeAll()
    }
}
