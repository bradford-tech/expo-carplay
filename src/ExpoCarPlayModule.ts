// ExpoCarPlayModule.ts
// Raw native module binding — no types, no logic.
// Feature modules (scene/scene.ts, map/map.ts, etc.) wrap these calls with typed APIs.

import { type EventSubscription, requireNativeModule } from 'expo-modules-core';

type ExpoCarPlayModule = {
  addListener(
    eventName: 'onConnect' | 'onDisconnect',
    listener: () => void
  ): EventSubscription;
};

export default requireNativeModule<ExpoCarPlayModule>('ExpoCarPlay');
