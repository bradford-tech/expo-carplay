// search/search.ts
// Typed API for CPSearchTemplate operations.
// See: docs/carplay-api-surface.md §6 — Search Template

import type { EventSubscription } from 'expo-modules-core';

import ExpoCarPlay from '../ExpoCarPlayModule';
import type {
  SearchResultItem,
  SearchResultSelectedEvent,
  SearchTextUpdatedEvent,
} from './search.types';

export async function createSearchTemplate(): Promise<string> {
  return ExpoCarPlay.createSearchTemplate();
}

export async function updateSearchResults(
  requestId: string,
  results: SearchResultItem[]
): Promise<void> {
  await ExpoCarPlay.updateSearchResults(requestId, results);
}

export function addSearchTextListener(
  listener: (event: SearchTextUpdatedEvent) => void
): EventSubscription {
  return ExpoCarPlay.addListener('onSearchTextUpdated', listener);
}

export function addSearchResultSelectedListener(
  listener: (event: SearchResultSelectedEvent) => void
): EventSubscription {
  return ExpoCarPlay.addListener('onSearchResultSelected', listener);
}

export function addSearchButtonPressedListener(
  listener: () => void
): EventSubscription {
  return ExpoCarPlay.addListener('onSearchButtonPressed', listener);
}
