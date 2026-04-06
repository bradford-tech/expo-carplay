// map/map.ts
// Typed API for CPMapTemplate and CarPlay map control.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import ExpoCarPlay from '../ExpoCarPlayModule';
import type { RouteSegment } from './map.types';

export async function createMapTemplate(): Promise<string> {
  return ExpoCarPlay.createMapTemplate();
}

export async function startFollowingUser(): Promise<void> {
  await ExpoCarPlay.startFollowingUser();
}

export async function stopFollowingUser(): Promise<void> {
  await ExpoCarPlay.stopFollowingUser();
}

export async function setCarPlayRoute(segments: RouteSegment[]): Promise<void> {
  await ExpoCarPlay.setCarPlayRoute(segments);
}

export async function clearCarPlayRoute(): Promise<void> {
  await ExpoCarPlay.clearCarPlayRoute();
}
