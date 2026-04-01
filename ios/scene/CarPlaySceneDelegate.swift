// CarPlaySceneDelegate.swift
// Implements CPTemplateApplicationSceneDelegate for both navigation and non-navigation apps.
// Owns the CarPlay connection lifecycle: creates handlers with the CPInterfaceController
// on connect, tears them down on disconnect.
// For navigation apps, also receives the CPWindow for rendering the base map view.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller
