// map/map.types.ts
// TypeScript interfaces for CarPlay map control.
// See: docs/carplay-api-surface.md §2

import type { BarButtonConfig, Coordinate } from '../shared/shared.types';

// Shared types are imported here for use (not re-exported — the barrel
// handles that via shared.types.ts). BarButtonStyle is referenced
// transitively through BarButtonConfig.style; consumers needing it
// directly should import from '../shared/shared.types'.

export type RouteSegment = {
  coordinates: Coordinate[];
  color: string; // hex "#RRGGBB" or UIKit name "systemTeal"
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

export type MapTemplateButtonsConfig = {
  leadingNavigationBarButtons?: BarButtonConfig[];
  trailingNavigationBarButtons?: BarButtonConfig[];
  mapButtons?: MapButtonConfig[];
};
