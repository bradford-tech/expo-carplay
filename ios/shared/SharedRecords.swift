// SharedRecords.swift
// Cross-cutting Records reused across multiple feature handlers.
// Feature-local Records live in ios/<feature>/<Feature>Records.swift.

import ExpoModulesCore

struct BarButtonConfig: Record {
    // `.required` throws FieldRequiredException if the key is missing from the
    // JS payload. Without it, Records silently fall back to type defaults
    // (String → ""), which would let a typo'd `id` produce a button whose tap
    // event emits an empty string — the consumer would have no way to tell
    // which button was pressed. Same pattern for any field where the empty
    // default is dangerously indistinguishable from a valid value.
    @Field(.required) var id: String
    @Field var title: String?
    @Field var systemImage: String?
    @Field var style: BarButtonStyle?
    @Field var enabled: Bool = true
}

enum BarButtonStyle: String, Enumerable {
    case none
    case rounded
}

struct Coordinate: Record {
    // `.required` here is critical: without it, a typo'd JS field
    // (e.g., `lattitude`) would silently coerce to 0.0, putting routes at
    // Null Island instead of erroring. See BarButtonConfig.id comment.
    @Field(.required) var latitude: Double
    @Field(.required) var longitude: Double
}
