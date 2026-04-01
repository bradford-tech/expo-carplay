// scene/useCarPlay.ts
// React hook for CarPlay connection state.
// Returns: { connected: boolean }.
// Subscribes to onConnect/onDisconnect events from the native module.
// See: docs/carplay-api-surface.md §1

import { useEffect, useState } from 'react';

import {
  addConnectListener,
  addDisconnectListener,
  isConnected,
} from './scene';

export function useCarPlay(): { connected: boolean } {
  const [connected, setConnected] = useState(isConnected());

  useEffect(() => {
    const connectSub = addConnectListener(() => setConnected(true));
    const disconnectSub = addDisconnectListener(() => setConnected(false));
    // Sync in case the event fired before the hook mounted
    setConnected(isConnected());
    return () => {
      connectSub.remove();
      disconnectSub.remove();
    };
  }, []);

  return { connected };
}
