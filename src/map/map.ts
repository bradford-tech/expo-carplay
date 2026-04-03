// map/map.ts
// Typed API for CPMapTemplate and CarPlay map control.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import ExpoCarPlay from '../ExpoCarPlayModule';
import type { Coordinate, LocationUpdate } from './map.types';

export async function createMapTemplate(): Promise<string> {
  return ExpoCarPlay.createMapTemplate();
}

export async function updateCarPlayLocation(
  location: LocationUpdate
): Promise<void> {
  await ExpoCarPlay.updateCarPlayLocation(location);
}

export async function setCarPlayRoute(
  coordinates: Coordinate[]
): Promise<void> {
  await ExpoCarPlay.setCarPlayRoute(coordinates);
}

export async function clearCarPlayRoute(): Promise<void> {
  await ExpoCarPlay.clearCarPlayRoute();
}
