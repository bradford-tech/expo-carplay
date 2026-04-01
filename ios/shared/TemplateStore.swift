// TemplateStore.swift
// Cross-cutting registry mapping JS string IDs to native CPTemplate instances.
// Every handler registers templates here on creation and removes them on disposal.
// Provides lookup by ID for template stack operations (push, pop, present).
// Used by SceneSessionManager and all template handlers.
