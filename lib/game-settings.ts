import {
  type Region,
  US_ASSOCIATED_STATES,
  US_FEDERAL_DISTRICTS,
  US_STATES,
  US_TERRITORIES,
} from "@/lib/us-states";

export interface GameSettings {
  includeDC: boolean;
  includeTerritories: boolean;
  includeAssociatedStates: boolean;
}

export const defaultSettings: GameSettings = {
  includeDC: false,
  includeTerritories: false,
  includeAssociatedStates: false,
};

export function getActiveStates(settings: GameSettings): Region[] {
  const regions: Region[] = [...US_STATES];
  if (settings.includeDC) regions.push(...US_FEDERAL_DISTRICTS);
  if (settings.includeTerritories) regions.push(...US_TERRITORIES);
  if (settings.includeAssociatedStates) regions.push(...US_ASSOCIATED_STATES);
  return regions;
}
