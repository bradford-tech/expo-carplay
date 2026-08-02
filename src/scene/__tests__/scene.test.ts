// scene.test.ts
// isConnected() delegates to the synchronous native query — the native
// SceneSession is the single source of truth for connection state, so a
// scene that connected before the JS bundle loaded (CarPlay-initiated cold
// launch, bradford-tech/wheelhouse#553) is visible without any JS-side
// latch to seed or keep in sync.

import type { EventSubscription } from 'expo-modules-core';

import { isConnected } from '../scene';

// `mock`-prefixed so jest's hoisted factory may close over them.
const mockIsCarPlayConnected = jest.fn((): boolean => false);
const mockAddListener = jest.fn(
  (
    _eventName: string,
    _listener: (event: unknown) => void
  ): EventSubscription => ({ remove: () => {} }) as EventSubscription
);

jest.mock('../../ExpoCarPlayModule', () => ({
  __esModule: true,
  default: {
    addListener: (eventName: string, listener: (event: unknown) => void) =>
      mockAddListener(eventName, listener),
    isCarPlayConnected: (): boolean => mockIsCarPlayConnected(),
  },
}));

beforeEach(() => {
  mockIsCarPlayConnected.mockReset().mockReturnValue(false);
  mockAddListener.mockClear();
});

describe('isConnected', () => {
  it('reports a scene that connected before the JS module loaded', () => {
    mockIsCarPlayConnected.mockReturnValue(true);

    expect(isConnected()).toBe(true);
  });

  it('reports disconnected when no scene exists', () => {
    expect(isConnected()).toBe(false);
  });

  it('reflects native state changes on every call (no JS-side cache)', () => {
    mockIsCarPlayConnected.mockReturnValueOnce(false).mockReturnValueOnce(true);

    expect(isConnected()).toBe(false);
    expect(isConnected()).toBe(true);
  });

  it('performs no native calls at module load', () => {
    // Importing the package must not touch native — it matters on web,
    // where every stub call fires the one-time unsupported warning.
    jest.isolateModules(() => {
      require('../scene');
    });

    expect(mockIsCarPlayConnected).not.toHaveBeenCalled();
    expect(mockAddListener).not.toHaveBeenCalled();
  });
});
