// CarPlayExceptions.swift
// Cross-cutting exception classes thrown by multiple template-stack
// call sites (setRootTemplate, pushTemplate, and later features).
// Feature-local exceptions, if they emerge, live alongside their handler.

import ExpoModulesCore

final class TemplateNotFoundException: GenericException<String> {
    override var reason: String {
        "Template not found: \(param)"
    }
}

final class CarPlayNotConnectedException: Exception {
    override var reason: String {
        "CarPlay is not connected"
    }
}
