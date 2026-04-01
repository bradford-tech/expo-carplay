// scene/scene.ts
// Typed API for CarPlay connection lifecycle.
// Maintains cached connection state for synchronous reads by hooks.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller

import { type EventSubscription } from 'expo-modules-core';

import ExpoCarPlay from '../ExpoCarPlayModule';
import type { ConnectEvent, DisconnectEvent } from './scene.types';

type SceneEventsMap = {
  onConnect: (event: ConnectEvent) => void;
  onDisconnect: (event: DisconnectEvent) => void;
};

// In Expo SDK 52+, the native module object IS an EventEmitter.
// We cast it to a properly-typed emitter so addListener calls are type-safe.
const emitter = ExpoCarPlay as InstanceType;

let connected = false;

emitter.addListener('onConnect', () => {
  connected = true;
});

emitter.addListener('onDisconnect', () => {
  connected = false;
});

export function isConnected(): boolean {
  return connected;
}

export function addConnectListener(
  listener: (event: ConnectEvent) => void
): EventSubscription {
  return emitter.addListener('onConnect', listener);
}

export function addDisconnectListener(
  listener: (event: DisconnectEvent) => void
): EventSubscription {
  return emitter.addListener('onDisconnect', listener);
}
