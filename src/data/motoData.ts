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

// Drive types
export const motoDriveTypes = [
  'chain',
  'cardan',
  'belt',
] as const;

// Number of cylinders
export const motoCylinders = [1, 2, 3, 4] as const;

// Number of gears
export const motoGears = [4, 5, 6] as const;

// Cooling types
export const motoCoolingTypes = [
  'air',
  'liquid',
  'oil',
  'air_oil',
] as const;

export type MotoType = typeof motoTypes[number];
export type MotoOriginCountry = typeof motoOriginCountries[number];
export type MotoCondition = typeof motoConditions[number];
export type MotoEngineType = typeof motoEngineTypes[number];
export type MotoFuelDelivery = typeof motoFuelDelivery[number];
export type MotoStroke = typeof motoStrokes[number];
export type MotoTransmission = typeof motoTransmissions[number];
export type MotoDriveType = typeof motoDriveTypes[number];
export type MotoCylinder = typeof motoCylinders[number];
export type MotoGear = typeof motoGears[number];
export type MotoCoolingType = typeof motoCoolingTypes[number];
