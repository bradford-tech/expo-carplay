// map/map.ts
// Typed API for CPMapTemplate operations.
// See: docs/carplay-api-surface.md §2 — Map Template & Map Buttons

import ExpoCarPlay from '../ExpoCarPlayModule';

export async function createMapTemplate(): Promise<string> {
  return ExpoCarPlay.createMapTemplate();
}
