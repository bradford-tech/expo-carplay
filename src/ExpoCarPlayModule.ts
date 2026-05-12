// ExpoCarPlayModule.ts
// Raw native module binding — no types, no logic.
// Feature modules (scene/scene.ts, map/map.ts, etc.) wrap these calls with typed APIs.

import { type EventSubscription, requireNativeModule } from 'expo-modules-core';

import type {
  EdgePadding,
  MapTemplateButtonsConfig,
  MapTemplateConfig,
  RouteSegment,
} from './map/map.types';
import type { SearchResultItem } from './search/search.types';

export type ExpoCarPlayModule = {
  addListener<T = void>(
    eventName: string,
    listener: (event: T) => void
  ): EventSubscription;
  createMapTemplate(config?: MapTemplateConfig | null): Promise<string>;
  updateMapTemplateButtons(config: MapTemplateButtonsConfig): Promise<void>;
  setRootTemplate(templateId: string): Promise<void>;
  pushTemplate(templateId: string): Promise<void>;
  popTemplate(): Promise<void>;
  startFollowingUser(): Promise<void>;
  stopFollowingUser(): Promise<void>;
  setCarPlayRoute(
    segments: RouteSegment[],
    edgePadding?: EdgePadding | null
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
  showTripPreviews(
    trips: {
      origin: { latitude: number; longitude: number };
      destination: { latitude: number; longitude: number };
      routeChoices: {
        summaryVariants: string[];
        additionalInformationVariants?: string[];
      }[];
    }[]
  ): Promise<void>;
  hideTripPreviews(): Promise<void>;
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
  createSearchTemplate(): Promise<string>;
  updateSearchResults(
    requestId: string,
    items: SearchResultItem[]
  ): Promise<void>;
};

export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
