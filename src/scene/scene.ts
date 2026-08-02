// scene/scene.ts
// Typed API for CarPlay connection lifecycle.
// Connection state is read from native on demand — no JS-side cache.
// See: docs/carplay-api-surface.md §1 — Scene Lifecycle & Interface Controller

import type { EventSubscription } from 'expo-modules-core';

import ExpoCarPlay from '../ExpoCarPlayModule';

// Delegates to the native scene registry rather than caching in JS. A JS
// latch fed by onConnect/onDisconnect misses any connect that fires before
// this module loads (CarPlay-initiated cold launch — the emit is
// fire-and-forget with no buffering; see bradford-tech/wheelhouse#553);
// querying native on every call makes that class of staleness impossible.
// Events remain the reactivity channel (useCarPlay, consumer listeners).
export function isConnected(): boolean {
  return ExpoCarPlay.isCarPlayConnected();
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
