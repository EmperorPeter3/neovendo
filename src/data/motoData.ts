// Motorcycle types
export const motoTypes = [
  'cruiser_chopper',
  'sportbike',
  'touring',
  'sport_touring',
  'tour_enduro',
  'trike',
  'naked',
  'motard',
  'enduro',
  'cross',
  'pitbike',
  'trial',
  'kids',
  'custom',
] as const;

// Origin countries (top-10 manufacturers + Other)
export const motoOriginCountries = [
  'japan',
  'usa',
  'germany',
  'italy',
  'uk',
  'austria',
  'spain',
  'india',
  'china',
  'taiwan',
  'other',
] as const;

// Conditions
export const motoConditions = [
  'new',
  'used',
  'for_parts',
] as const;

// Engine types
export const motoEngineTypes = [
  'petrol',
  'electric',
] as const;

// Fuel delivery
export const motoFuelDelivery = [
  'carburetor',
  'injector',
] as const;

// Number of strokes
export const motoStrokes = [
  2,
  4,
] as const;

// Transmission types
export const motoTransmissions = [
  'manual',
  'automatic',
  'robot',
  'variator',
] as const;

export type MotoType = typeof motoTypes[number];
export type MotoOriginCountry = typeof motoOriginCountries[number];
export type MotoCondition = typeof motoConditions[number];
export type MotoEngineType = typeof motoEngineTypes[number];
export type MotoFuelDelivery = typeof motoFuelDelivery[number];
export type MotoStroke = typeof motoStrokes[number];
export type MotoTransmission = typeof motoTransmissions[number];
