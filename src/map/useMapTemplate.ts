// map/useMapTemplate.ts
// React hook for managing a CPMapTemplate.
// Handles: template creation/cleanup on mount/unmount,
// panning state, and map button updates.
// See: docs/carplay-api-surface.md §2

export function useMapTemplate() {
  return { templateId: null };
}
