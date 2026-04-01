// EventEmitter.swift
// Cross-cutting utility for sending events from native handlers to JS.
// Wraps ExpoModulesCore event emission with a consistent interface.
// All handlers call EventEmitter rather than coupling directly to the module instance.
