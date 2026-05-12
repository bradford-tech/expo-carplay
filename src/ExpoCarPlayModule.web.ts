// ExpoCarPlayModule.web.ts
// Web stub. CarPlay is iOS-only; this file lets web bundles import the package
// without crashing autolinking. Every method warns once and resolves to a safe
// default so consumers can guard with `Platform.OS === 'ios'`.
//
// The `: ExpoCarPlayModule` annotation forces this stub to stay in sync with
// the native interface — adding a method to ExpoCarPlayModule.ts fails the
// web build until the stub is updated.

import type { EventSubscription } from 'expo-modules-core';

import type { ExpoCarPlayModule } from './ExpoCarPlayModule';
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

let warned = false;
function warn(): void {
  if (!warned) {
    console.warn('@bradford-tech/expo-carplay is not supported on web');
    warned = true;
  }
}

const noopSubscription: EventSubscription = { remove: () => {} };

const webModule: ExpoCarPlayModule = {
  addListener: <T = void>(
    _eventName: string,
    _listener: (event: T) => void
  ): EventSubscription => {
    warn();
    return noopSubscription;
  },
  createMapTemplate: (_config?: MapTemplateConfig | null): Promise<string> => {
    warn();
    return Promise.resolve('');
  },
  updateMapTemplateButtons: (
    _config: MapTemplateButtonsConfig
  ): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  setRootTemplate: (_templateId: string): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  pushTemplate: (_templateId: string): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  popTemplate: (): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  startFollowingUser: (): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  stopFollowingUser: (): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  setCarPlayRoute: (
    _segments: RouteSegment[],
    _edgePadding?: EdgePadding | null
  ): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  clearCarPlayRoute: (): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  startNavigation: (_tripConfig: TripConfig): Promise<string> => {
    warn();
    return Promise.resolve('');
  },
  stopNavigation: (): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  showTripPreviews: (_trips: TripConfig[]): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  hideTripPreviews: (): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  updateManeuvers: (_maneuvers: ManeuverConfig[]): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  updateTravelEstimates: (
    _estimates: TravelEstimates,
    _maneuverIndex?: number
  ): Promise<void> => {
    warn();
    return Promise.resolve();
  },
  createSearchTemplate: (): Promise<string> => {
    warn();
    return Promise.resolve('');
  },
  updateSearchResults: (
    _requestId: string,
    _items: SearchResultItem[]
  ): Promise<void> => {
    warn();
    return Promise.resolve();
  },
};

export default webModule;
