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
  /** SF Symbol name for the button icon */
  systemImage?: string;
  /** Text label — renders as a pill-shaped button (use with backgroundColor) */
  title?: string;
  /** Hex color for pill background (e.g., "#FF3B30"). Only used with title. */
  backgroundColor?: string;
  enabled?: boolean;
  hidden?: boolean;
};

export type EdgePadding = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

export type MapTemplateConfig = {
  leadingNavigationBarButtons?: BarButtonConfig[];
  trailingNavigationBarButtons?: BarButtonConfig[];
  mapButtons?: MapButtonConfig[];
  automaticallyHidesNavigationBar?: boolean;
  hidesButtonsWithNavigationBar?: boolean;
};
