// map/map.ts
// Typed API for CPMapTemplate and CarPlay map control.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import type { EventSubscription } from 'expo-modules-core';

import ExpoCarPlay from '../ExpoCarPlayModule';
import type { EdgePadding, MapTemplateConfig, RouteSegment } from './map.types';

export async function createMapTemplate(
  config?: MapTemplateConfig
): Promise<string> {
  return ExpoCarPlay.createMapTemplate(config ?? null);
}

export async function startFollowingUser(): Promise<void> {
  await ExpoCarPlay.startFollowingUser();
}

export async function stopFollowingUser(): Promise<void> {
  await ExpoCarPlay.stopFollowingUser();
}

export async function setCarPlayRoute(
  segments: RouteSegment[],
  edgePadding?: EdgePadding
): Promise<void> {
  await ExpoCarPlay.setCarPlayRoute(segments, edgePadding ?? null);
}

export async function clearCarPlayRoute(): Promise<void> {
  await ExpoCarPlay.clearCarPlayRoute();
}

export function addBarButtonPressedListener(
  listener: (event: { id: string }) => void
): EventSubscription {
  return ExpoCarPlay.addListener('onBarButtonPressed', listener);
}

export function addMapButtonPressedListener(
  listener: (event: { id: string }) => void
): EventSubscription {
  return ExpoCarPlay.addListener('onMapButtonPressed', listener);
}
