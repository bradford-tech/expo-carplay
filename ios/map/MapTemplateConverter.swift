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

            if let title = config["title"] as? String {
                // Render a pill-shaped image with text and optional background color
                let bgColor = (config["backgroundColor"] as? String).flatMap { ColorConverter.color(from: $0) } ?? .systemBlue
                button.image = renderPillImage(title: title, backgroundColor: bgColor)
            } else if let systemImage = config["systemImage"] as? String {
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

    // MARK: - Pill Image Rendering

    private static func renderPillImage(title: String, backgroundColor: UIColor) -> UIImage {
        let font = UIFont.boldSystemFont(ofSize: 24)
        let textAttributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: UIColor.white
        ]
        let textSize = (title as NSString).size(withAttributes: textAttributes)
        let padding = UIEdgeInsets(top: 12, left: 24, bottom: 12, right: 24)
        let imageSize = CGSize(
            width: textSize.width + padding.left + padding.right,
            height: textSize.height + padding.top + padding.bottom
        )

        let renderer = UIGraphicsImageRenderer(size: imageSize)
        return renderer.image { _ in
            let rect = CGRect(origin: .zero, size: imageSize)
            let path = UIBezierPath(roundedRect: rect, cornerRadius: imageSize.height / 2)
            backgroundColor.setFill()
            path.fill()

            let textRect = CGRect(
                x: padding.left,
                y: padding.top,
                width: textSize.width,
                height: textSize.height
            )
            (title as NSString).draw(in: textRect, withAttributes: textAttributes)
        }
    }
}
