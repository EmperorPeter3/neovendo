// Snowmobile data constants

export const snowmobileTypes = [
  { id: 'utility', translationKey: 'snowmobileFilters.typeUtility' },
  { id: 'sport_mountain', translationKey: 'snowmobileFilters.typeSportMountain' },
  { id: 'touring', translationKey: 'snowmobileFilters.typeTouring' },
  { id: 'kids', translationKey: 'snowmobileFilters.typeKids' },
  { id: 'motobuksir', translationKey: 'snowmobileFilters.typeMotobuksir' },
];

export const snowmobileOriginCountries = [
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

export const snowmobileConditions = [
  { id: 'new', translationKey: 'snowmobileFilters.conditionNew' },
  { id: 'used', translationKey: 'snowmobileFilters.conditionUsed' },
  { id: 'for_parts', translationKey: 'snowmobileFilters.conditionForParts' },
];

export const snowmobileEngineTypes = [
  { id: 'petrol', translationKey: 'snowmobileFilters.enginePetrol' },
  { id: 'electric', translationKey: 'snowmobileFilters.engineElectric' },
];

export const getYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear + 1; year >= 1970; year--) {
    years.push(year);
  }
  return years;
};
