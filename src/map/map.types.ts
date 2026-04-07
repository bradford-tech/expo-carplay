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

export type BarButtonConfig = {
  id: string;
  title?: string;
  systemImage?: string;
  style?: 'none' | 'rounded';
  enabled?: boolean;
};

export type MapButtonConfig = {
  id: string;
  systemImage: string;
  enabled?: boolean;
  hidden?: boolean;
};

export type MapTemplateConfig = {
  leadingNavigationBarButtons?: BarButtonConfig[];
  trailingNavigationBarButtons?: BarButtonConfig[];
  mapButtons?: MapButtonConfig[];
  automaticallyHidesNavigationBar?: boolean;
  hidesButtonsWithNavigationBar?: boolean;
};
