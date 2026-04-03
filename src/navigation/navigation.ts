// navigation/navigation.ts
// Typed API for CPNavigationSession lifecycle.
// See: docs/carplay-api-surface.md §3 — Navigation Session & Route Guidance

import ExpoCarPlay from '../ExpoCarPlayModule';
import type {
  ManeuverConfig,
  TravelEstimates,
  TripConfig,
} from './navigation.types';

let activeSessionId: string | null = null;

export async function startNavigation(trip: TripConfig): Promise<string> {
  const sessionId = await ExpoCarPlay.startNavigation(trip);
  activeSessionId = sessionId;
  return sessionId;
}

export async function stopNavigation(): Promise<void> {
  await ExpoCarPlay.stopNavigation();
  activeSessionId = null;
}

export async function updateManeuvers(
  maneuvers: ManeuverConfig[]
): Promise<void> {
  await ExpoCarPlay.updateManeuvers(maneuvers);
}

export async function updateTravelEstimates(
  estimates: TravelEstimates,
  maneuverIndex?: number
): Promise<void> {
  await ExpoCarPlay.updateTravelEstimates(estimates, maneuverIndex);
}

export function getActiveSessionId(): string | null {
  return activeSessionId;
}
