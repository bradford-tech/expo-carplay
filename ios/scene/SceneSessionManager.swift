// SceneSessionManager.swift
// Holds references to the active CPInterfaceController and CPWindow for the current session.
// Provides these to handlers via dependency injection — handlers never access singletons.
// Manages template stack operations (push, pop, setRoot, present, dismiss).
// See: docs/carplay-api-surface.md §1 — CPInterfaceController
