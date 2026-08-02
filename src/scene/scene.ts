// scene/scene.ts
// Typed API for CarPlay connection lifecycle.
// Maintains cached connection state for synchronous reads by hooks.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller

import type { EventSubscription } from 'expo-modules-core';

import ExpoCarPlay from '../ExpoCarPlayModule';

let connected = false;

ExpoCarPlay.addListener('onConnect', () => {
  connected = true;
});

ExpoCarPlay.addListener('onDisconnect', () => {
  connected = false;
});

// Seed the latch AFTER attaching listeners. The native onConnect emit is
// fire-and-forget with no buffering, so a scene that connected before this
// module loaded (CarPlay-initiated cold launch with the phone in a pocket)
// never reaches the listeners — without this query, isConnected() reads
// false-negative for the entire process lifetime. Listener-then-query
// ordering means a connect landing in between is observed by both, which is
// idempotent; the reverse order would drop it entirely.
// See: bradford-tech/wheelhouse#553
connected = ExpoCarPlay.isCarPlayConnected();

export function isConnected(): boolean {
  return connected;
}

export function addConnectListener(listener: () => void): EventSubscription {
  return ExpoCarPlay.addListener('onConnect', listener);
}

export function addDisconnectListener(listener: () => void): EventSubscription {
  return ExpoCarPlay.addListener('onDisconnect', listener);
}

export async function setRootTemplate(templateId: string): Promise<void> {
  await ExpoCarPlay.setRootTemplate(templateId);
}

export async function pushTemplate(templateId: string): Promise<void> {
  await ExpoCarPlay.pushTemplate(templateId);
}

export async function popTemplate(): Promise<void> {
  await ExpoCarPlay.popTemplate();
}
