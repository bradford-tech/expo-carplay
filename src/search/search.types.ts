// search/search.types.ts
// TypeScript interfaces for search template events and results.
// See: docs/carplay-api-surface.md §6

export type SearchResultItem = {
  text: string;
  detailText?: string;
};

export type SearchTextUpdatedEvent = {
  requestId: string;
  searchText: string;
};

export type SearchResultSelectedEvent = {
  text: string;
  detailText: string;
};
