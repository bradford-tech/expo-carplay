// TemplateStore.swift
// Cross-cutting registry mapping JS string IDs to native CPTemplate instances.
// Cleared on CarPlay disconnect and when setRootTemplate replaces the hierarchy.

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
