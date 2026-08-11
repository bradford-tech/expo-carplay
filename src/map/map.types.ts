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
  /** CarPlay shows up to 2 leading bar buttons; additional entries are ignored. */
  leadingNavigationBarButtons?: BarButtonConfig[];
  /** CarPlay shows up to 2 trailing bar buttons; additional entries are ignored. */
  trailingNavigationBarButtons?: BarButtonConfig[];
  /** CarPlay shows up to 3 map buttons; additional entries are ignored. */
  mapButtons?: MapButtonConfig[];
  automaticallyHidesNavigationBar?: boolean;
  hidesButtonsWithNavigationBar?: boolean;
  /**
   * Hex color (e.g., "#30B0C7") for the turn-by-turn guidance bar
   * background. When omitted, CarPlay uses the system default (red).
   */
  guidanceBackgroundColor?: string;
};

export type MapTemplateButtonsConfig = {
  /** CarPlay shows up to 2 leading bar buttons; additional entries are ignored. */
  leadingNavigationBarButtons?: BarButtonConfig[];
  /** CarPlay shows up to 2 trailing bar buttons; additional entries are ignored. */
  trailingNavigationBarButtons?: BarButtonConfig[];
  /** CarPlay shows up to 3 map buttons; additional entries are ignored. */
  mapButtons?: MapButtonConfig[];
};

/**
 * Camera follow mode for the CarPlay map.
 * - `off`: camera is not written; the user has panned away.
 * - `browseNorthUp`: follows the user, north-up, flat.
 * - `browseHeadingUp`: follows the user, rotated to GPS course, flat.
 * - `navigation`: follows the user, tilted, oriented to the active route.
 */
export type FollowMode =
  | 'off'
  | 'browseNorthUp'
  | 'browseHeadingUp'
  | 'navigation';
