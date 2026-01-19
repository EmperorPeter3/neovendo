// Quad & Buggy data constants

export const quadTypes = [
  { id: 'buggy', translationKey: 'quadFilters.typeBuggy' },
  { id: 'utility', translationKey: 'quadFilters.typeUtility' },
  { id: 'sport', translationKey: 'quadFilters.typeSport' },
  { id: 'touring', translationKey: 'quadFilters.typeTouring' },
  { id: 'kids', translationKey: 'quadFilters.typeKids' },
];

// Top 10 ATV/Quad manufacturer countries + Other
export const quadOriginCountries = [
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

export const quadConditions = [
  { id: 'new', translationKey: 'quadFilters.conditionNew' },
  { id: 'used', translationKey: 'quadFilters.conditionUsed' },
  { id: 'for_parts', translationKey: 'quadFilters.conditionForParts' },
];

export const quadEngineTypes = [
  { id: 'petrol', translationKey: 'quadFilters.enginePetrol' },
  { id: 'electric', translationKey: 'quadFilters.engineElectric' },
];

export const getYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear + 1; year >= 1970; year--) {
    years.push(year);
  }
  return years;
};
