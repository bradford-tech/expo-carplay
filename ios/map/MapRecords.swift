// MapRecords.swift
// Records for CPMapTemplate inputs (create, button updates, route segments).

import ExpoModulesCore

struct MapTemplateConfig: Record {
    @Field var leadingNavigationBarButtons: [BarButtonConfig] = []
    @Field var trailingNavigationBarButtons: [BarButtonConfig] = []
    @Field var mapButtons: [MapButtonConfig] = []
    @Field var automaticallyHidesNavigationBar: Bool = true
    @Field var hidesButtonsWithNavigationBar: Bool = true
    /// Hex color (e.g., "#30B0C7") for the turn-by-turn guidance bar
    /// background. When nil, CarPlay uses the system default (red).
    @Field var guidanceBackgroundColor: String?
}

struct MapTemplateButtonsConfig: Record {
    // Optional arrays: nil = leave that group alone; empty = clear that group.
    @Field var leadingNavigationBarButtons: [BarButtonConfig]?
    @Field var trailingNavigationBarButtons: [BarButtonConfig]?
    @Field var mapButtons: [MapButtonConfig]?
}

struct MapButtonConfig: Record {
    // `.required` — see BarButtonConfig.id comment in SharedRecords.swift.
    @Field(.required) var id: String
    @Field var systemImage: String?
    @Field var title: String?
    @Field var backgroundColor: String?
    @Field var enabled: Bool = true
    @Field var hidden: Bool = false
}

struct RouteSegment: Record {
    @Field var coordinates: [Coordinate]
    @Field var color: String
}

struct EdgePadding: Record {
    @Field var top: Double = 40
    @Field var left: Double = 40
    @Field var bottom: Double = 40
    @Field var right: Double = 40
}
