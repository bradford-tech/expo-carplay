// scene/scene.types.ts
// TypeScript interfaces for scene lifecycle events and interface controller state.
// See: docs/carplay-api-surface.md §1

export type ConnectEvent = Record;

export type DisconnectEvent = Record;

export type CarPlayConnectionState = {
  connected: boolean;
};
