// MapTemplateConverter.swift
// Converts JS config dictionaries to CPMapTemplate properties.
// Handles: CPMapButton, CPBarButton, CPBarButtonStyle, PanDirection,
// and CPBarButtonProviding (leadingNavigationBarButtons, trailingNavigationBarButtons).
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import CarPlay

enum MapTemplateConverter {
    static func buildBarButtons(from configs: [[String: Any]]) -> [CPBarButton] {
        configs.compactMap { config in
            guard let id = config["id"] as? String else { return nil }

            let handler: (CPBarButton) -> Void = { _ in
                CarPlayEventEmitter.shared.emit("onBarButtonPressed", ["id": id])
            }

            let button: CPBarButton
            if let systemImage = config["systemImage"] as? String,
               let image = UIImage(systemName: systemImage) {
                button = CPBarButton(image: image, handler: handler)
            } else if let title = config["title"] as? String {
                button = CPBarButton(title: title, handler: handler)
            } else {
                return nil
            }

            if let styleString = config["style"] as? String, styleString == "rounded" {
                button.buttonStyle = .rounded
            }

            if let enabled = config["enabled"] as? Bool {
                button.isEnabled = enabled
            }

            return button
        }
    }

    static func buildMapButtons(from configs: [[String: Any]]) -> [CPMapButton] {
        configs.compactMap { config in
            guard let id = config["id"] as? String else { return nil }

            let button = CPMapButton { _ in
                CarPlayEventEmitter.shared.emit("onMapButtonPressed", ["id": id])
            }

            if let systemImage = config["systemImage"] as? String {
                button.image = UIImage(systemName: systemImage)
            }

            if let enabled = config["enabled"] as? Bool {
                button.isEnabled = enabled
            }

            if let hidden = config["hidden"] as? Bool {
                button.isHidden = hidden
            }

            return button
        }
    }
}
