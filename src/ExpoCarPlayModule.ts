// ExpoCarPlayModule.ts
// Raw native module binding — no types, no logic.
// Feature modules (scene/scene.ts, map/map.ts, etc.) wrap these calls with typed APIs.

import { type EventSubscription, requireNativeModule } from 'expo-modules-core';

type ExpoCarPlayModule = {
  addListener(
    eventName: 'onConnect' | 'onDisconnect',
    listener: () => void
  ): EventSubscription;
  createMapTemplate(): Promise<string>;
  setRootTemplate(templateId: string): Promise<void>;
  startFollowingUser(): Promise<void>;
  stopFollowingUser(): Promise<void>;
  setCarPlayRoute(
    segments: {
      coordinates: { latitude: number; longitude: number }[];
      color: string;
    }[]
  ): Promise<void>;
  clearCarPlayRoute(): Promise<void>;
  startNavigation(tripConfig: {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    routeChoices: {
      summaryVariants: string[];
      additionalInformationVariants?: string[];
    }[];
  }): Promise<string>;
  stopNavigation(): Promise<void>;
  updateManeuvers(
    maneuvers: {
      instructionVariants: string[];
      symbolImage?: { systemName: string } | { uri: string };
      distanceRemaining?: number;
      timeRemaining?: number;
    }[]
  ): Promise<void>;
  updateTravelEstimates(
    estimates: { distanceRemaining: number; timeRemaining: number },
    maneuverIndex?: number
  ): Promise<void>;
};

export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
