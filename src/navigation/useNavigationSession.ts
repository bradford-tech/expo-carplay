// navigation/useNavigationSession.ts
// React hook for active navigation state.
// Returns: session info, update functions, and navigation event callbacks.
// Subscribes to: onNavigationStarted, onNavigationEnded, onRouteSelected, etc.
// See: docs/carplay-api-surface.md §3

export function useNavigationSession() {
  return { sessionId: null };
}
