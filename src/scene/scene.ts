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
