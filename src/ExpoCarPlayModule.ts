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
    coordinates: { latitude: number; longitude: number }[]
  ): Promise<void>;
  clearCarPlayRoute(): Promise<void>;
};

export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
