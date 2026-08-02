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
import type {
  ManeuverConfig,
  TravelEstimates,
  TripConfig,
} from './navigation/navigation.types';
import type { SearchResultItem } from './search/search.types';

export type ExpoCarPlayModule = {
  addListener<T = void>(
    eventName: string,
    listener: (event: T) => void
  ): EventSubscription;
  /**
   * Synchronous native query for scene existence. Exists because the
   * onConnect emit is fire-and-forget: a scene that connects before JS
   * attaches listeners (CarPlay-initiated cold launch) is otherwise
   * unobservable. scene.ts uses it to seed the connection latch at load.
   */
  isCarPlayConnected(): boolean;
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
  startNavigation(tripConfig: TripConfig): Promise<string>;
  stopNavigation(): Promise<void>;
  /** CarPlay shows up to 12 trip previews; additional entries are ignored. */
  showTripPreviews(trips: TripConfig[]): Promise<void>;
  hideTripPreviews(): Promise<void>;
  updateManeuvers(maneuvers: ManeuverConfig[]): Promise<void>;
  updateTravelEstimates(
    estimates: TravelEstimates,
    maneuverIndex?: number
  ): Promise<void>;
  createSearchTemplate(): Promise<string>;
  updateSearchResults(
    requestId: string,
    items: SearchResultItem[]
  ): Promise<void>;
};

export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
