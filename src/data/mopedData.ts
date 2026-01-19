// Moped/Scooter types
export const mopedTypes = [
  'scooter',
  'maxi_scooter',
  'moped',
  'mini_bike',
] as const;

// Origin countries (top-10 manufacturers + Other)
export const mopedOriginCountries = [
  'japan',
  'china',
  'taiwan',
  'italy',
  'germany',
  'usa',
  'france',
  'india',
  'austria',
  'uk',
  'other',
] as const;

// Conditions
export const mopedConditions = [
  'new',
  'used',
  'for_parts',
] as const;

// Engine types
export const mopedEngineTypes = [
  'petrol',
  'electric',
] as const;

export type MopedType = typeof mopedTypes[number];
export type MopedOriginCountry = typeof mopedOriginCountries[number];
export type MopedCondition = typeof mopedConditions[number];
export type MopedEngineType = typeof mopedEngineTypes[number];
