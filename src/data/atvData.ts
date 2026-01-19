// ATV (All-Terrain Vehicle) data constants

export const atvTypes = [
  { id: 'tracked', translationKey: 'atvFilters.typeTracked' },
  { id: 'wheeled', translationKey: 'atvFilters.typeWheeled' },
  { id: 'homemade', translationKey: 'atvFilters.typeHomemade' },
];

// Top 10 ATV/snowmobile manufacturer countries + Other
export const atvOriginCountries = [
  { id: 'japan', translationKey: 'countries.japan' },
  { id: 'usa', translationKey: 'countries.usa' },
  { id: 'canada', translationKey: 'countries.canada' },
  { id: 'russia', translationKey: 'countries.russia' },
  { id: 'germany', translationKey: 'countries.germany' },
  { id: 'china', translationKey: 'countries.china' },
  { id: 'sweden', translationKey: 'countries.sweden' },
  { id: 'austria', translationKey: 'countries.austria' },
  { id: 'taiwan', translationKey: 'countries.taiwan' },
  { id: 'italy', translationKey: 'countries.italy' },
  { id: 'other', translationKey: 'countries.other' },
];

export const atvConditions = [
  { id: 'new', translationKey: 'atvFilters.conditionNew' },
  { id: 'used', translationKey: 'atvFilters.conditionUsed' },
  { id: 'for_parts', translationKey: 'atvFilters.conditionForParts' },
];

export const atvEngineTypes = [
  { id: 'petrol', translationKey: 'atvFilters.enginePetrol' },
  { id: 'diesel', translationKey: 'atvFilters.engineDiesel' },
  { id: 'electric', translationKey: 'atvFilters.engineElectric' },
];

export const getYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear + 1; year >= 1970; year--) {
    years.push(year);
  }
  return years;
};
