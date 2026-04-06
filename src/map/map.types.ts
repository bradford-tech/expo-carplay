// map/map.types.ts
// TypeScript interfaces for CarPlay map control.
// See: docs/carplay-api-surface.md §2

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type RouteSegment = {
  coordinates: Coordinate[];
  color: string; // hex "#RRGGBB" or UIKit name "systemTeal"
};
