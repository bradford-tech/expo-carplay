// ManeuverBuilder.swift
// Constructs CPManeuver from JS config dictionaries.
// Handles SF Symbol and URI image resolution, wraps in CPImageSet.
// See: docs/carplay-api-surface.md §4 — Maneuvers & Lane Guidance

import CarPlay

enum ManeuverBuilder {
    static func build(from config: [String: Any]) -> CPManeuver {
        let maneuver = CPManeuver()

        // Instruction variants (array of strings, longest first)
        if let variants = config["instructionVariants"] as? [String] {
            maneuver.instructionVariants = variants
        }

        // Symbol image — SF Symbol or URI
        if let imageConfig = config["symbolImage"] as? [String: String] {
            if let image = resolveImage(imageConfig) {
                let imageSet = CPImageSet(
                    lightContentImage: image,
                    darkContentImage: image
                )
                maneuver.symbolSet = imageSet
            }
        }

        // Initial travel estimates
        let distanceMeters = config["distanceRemaining"] as? Double
        let timeSeconds = config["timeRemaining"] as? Double
        if let dist = distanceMeters, let time = timeSeconds {
            maneuver.initialTravelEstimates = CPTravelEstimates(
                distanceRemaining: Measurement(value: dist, unit: .meters),
                timeRemaining: time
            )
        } else if let dist = distanceMeters {
            maneuver.initialTravelEstimates = CPTravelEstimates(
                distanceRemaining: Measurement(value: dist, unit: .meters),
                timeRemaining: 0
            )
        }

        return maneuver
    }

    static func buildArray(from configs: [[String: Any]]) -> [CPManeuver] {
        configs.map { build(from: $0) }
    }

    // MARK: - Image Resolution

    private static func resolveImage(_ config: [String: String]) -> UIImage? {
        if let systemName = config["systemName"] {
            return UIImage(systemName: systemName)
        }
        if let uri = config["uri"] {
            // Handle file:// URIs
            let path = uri.hasPrefix("file://") ? String(uri.dropFirst(7)) : uri
            return UIImage(contentsOfFile: path)
        }
        return nil
    }
}
