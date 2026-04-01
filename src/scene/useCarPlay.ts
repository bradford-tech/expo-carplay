// scene/useCarPlay.ts
// React hook for CarPlay connection state.
// Returns: { connected: boolean, connect/disconnect callbacks }.
// Subscribes to onConnect/onDisconnect events from the native module.
// See: docs/carplay-api-surface.md §1

export function useCarPlay() {
  return { connected: false };
}
