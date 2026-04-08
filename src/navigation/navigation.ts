// navigation/navigation.ts
// Typed API for CPNavigationSession lifecycle.
// See: docs/carplay-api-surface.md §3 — Navigation Session & Route Guidance

import type { EventSubscription } from 'expo-modules-core';

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

export async function showTripPreviews(trips: TripConfig[]): Promise<void> {
  await ExpoCarPlay.showTripPreviews(trips);
}

export async function hideTripPreviews(): Promise<void> {
  await ExpoCarPlay.hideTripPreviews();
}

export function addTripPreviewSelectedListener(
  listener: (event: { tripIndex: number; routeIndex: number }) => void
): EventSubscription {
  return ExpoCarPlay.addListener('onTripPreviewSelected', listener);
}

export function addTripStartedListener(
  listener: (event: { tripIndex: number; routeIndex: number }) => void
): EventSubscription {
  return ExpoCarPlay.addListener('onTripStarted', listener);
}
