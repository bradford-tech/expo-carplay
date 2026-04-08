// navigation/navigation.types.ts
// TypeScript interfaces for navigation session configuration.
// See: docs/carplay-api-surface.md §3

export type TripConfig = {
  origin: { latitude: number; longitude: number; name?: string };
  destination: { latitude: number; longitude: number; name?: string };
  routeChoices: {
    summaryVariants: string[];
    additionalInformationVariants?: string[];
  }[];
};

export type ManeuverConfig = {
  instructionVariants: string[];
  symbolImage?: { systemName: string } | { uri: string };
  distanceRemaining?: number;
  timeRemaining?: number;
};

export type TravelEstimates = {
  distanceRemaining: number;
  timeRemaining: number;
};
