// map/map.types.ts
// TypeScript interfaces for CarPlay map control.
// See: docs/carplay-api-surface.md §2

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type LocationUpdate = {
  latitude: number;
  longitude: number;
  course: number;
  speed: number;
};
