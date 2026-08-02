// scene.test.ts
// Connection-latch behavior, including the cold-launch recovery path:
// when the CarPlay scene connects before this JS module loads, the native
// onConnect emit is lost (fire-and-forget, no buffering), so the latch must
// seed itself from a direct native query at module load. See issue
// bradford-tech/wheelhouse#553 for the field failure this pins.

import type { EventSubscription } from 'expo-modules-core';

type Listener = (event: unknown) => void;

// `mock`-prefixed so jest's hoisted factory may close over them.
const mockListeners: Record<string, Listener[]> = {};
const mockIsCarPlayConnected = jest.fn((): boolean => false);

jest.mock('../../ExpoCarPlayModule', () => ({
  __esModule: true,
  default: {
    addListener: (eventName: string, listener: Listener): EventSubscription => {
      (mockListeners[eventName] ??= []).push(listener);
      return { remove: () => {} } as EventSubscription;
    },
    isCarPlayConnected: (): boolean => mockIsCarPlayConnected(),
  },
}));

/**
 * scene.ts seeds its latch at module load, so every test needs a fresh
 * module instance loaded AFTER the native mock is configured.
 */
function loadScene(): typeof import('../scene') {
  let scene!: typeof import('../scene');
  jest.isolateModules(() => {
    scene = require('../scene');
  });
  return scene;
}

function fire(eventName: 'onConnect' | 'onDisconnect'): void {
  for (const listener of mockListeners[eventName] ?? []) {
    listener(undefined);
  }
}

beforeEach(() => {
  for (const key of Object.keys(mockListeners)) {
    delete mockListeners[key];
  }
  mockIsCarPlayConnected.mockReset().mockReturnValue(false);
});

describe('isConnected latch', () => {
  it('reports connected at load when the scene connected before JS attached listeners', () => {
    mockIsCarPlayConnected.mockReturnValue(true);

    const scene = loadScene();

    expect(scene.isConnected()).toBe(true);
  });

  it('reports disconnected at load when no scene exists', () => {
    const scene = loadScene();

    expect(scene.isConnected()).toBe(false);
  });

  it('flips to connected when the onConnect event arrives after load', () => {
    const scene = loadScene();

    fire('onConnect');

    expect(scene.isConnected()).toBe(true);
  });

  it('resets a seeded connection when the onDisconnect event arrives', () => {
    mockIsCarPlayConnected.mockReturnValue(true);

    const scene = loadScene();
    expect(scene.isConnected()).toBe(true);

    fire('onDisconnect');

    expect(scene.isConnected()).toBe(false);
  });
});
