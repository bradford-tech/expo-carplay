// shared/shared.types.ts
// Cross-cutting types reused by multiple feature modules.
// Mirrors ios/shared/SharedRecords.swift.

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type BarButtonStyle = 'none' | 'rounded';

export type BarButtonConfig = {
  id: string;
  title?: string;
  systemImage?: string;
  style?: BarButtonStyle;
  enabled?: boolean;
};
