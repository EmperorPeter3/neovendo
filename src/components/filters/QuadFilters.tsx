import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { quadTypes, quadOriginCountries, quadEngineTypes, getYearOptions } from '@/data/quadData';
import { useMemo } from 'react';

export interface QuadFiltersState {
  // Type
  typeBuggy: boolean;
  typeUtility: boolean;
  typeSport: boolean;
  typeTouring: boolean;
  typeKids: boolean;
  // Brand
  brand: string;
  // Origin countries
  originCountries: string[];
  // Year
  yearFrom: string;
  yearTo: string;
  // Condition
  condition: 'all' | 'new' | 'used' | 'for_parts';
  // Engine
  enginePetrol: boolean;
  engineElectric: boolean;
  engineVolumeFrom: string;
  engineVolumeTo: string;
  // Power
  powerFrom: string;
  powerTo: string;
  // Mileage
  mileageFrom: string;
  mileageTo: string;
  // Passengers
  maxPassengersFrom: string;
  maxPassengersTo: string;
  // Description search
  descriptionSearch: string;
}

export const defaultQuadFilters: QuadFiltersState = {
  typeBuggy: false,
  typeUtility: false,
  typeSport: false,
  typeTouring: false,
  typeKids: false,
  brand: '',
  originCountries: [],
  yearFrom: '',
  yearTo: '',
  condition: 'all',
  enginePetrol: false,
  engineElectric: false,
  engineVolumeFrom: '',
  engineVolumeTo: '',
  powerFrom: '',
  powerTo: '',
  mileageFrom: '',
  mileageTo: '',
  maxPassengersFrom: '',
  maxPassengersTo: '',
  descriptionSearch: '',
};

interface QuadFiltersProps {
  filters: QuadFiltersState;
  onChange: (filters: QuadFiltersState) => void;
}

export function QuadFilters({ filters, onChange }: QuadFiltersProps) {
  const { t } = useLanguage();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const safeT = (key: string): string => {
    return t(key as TranslationKey);
  };

  const handleChange = <K extends keyof QuadFiltersState>(key: K, value: QuadFiltersState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const handleOriginCountryToggle = (countryId: string, checked: boolean) => {
    const newCountries = checked
      ? [...filters.originCountries, countryId]
      : filters.originCountries.filter(c => c !== countryId);
    handleChange('originCountries', newCountries);
  };

  const renderRangeInputs = (
    label: string,
    fromKey: keyof QuadFiltersState,
    toKey: keyof QuadFiltersState,
    placeholder: string = ''
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder={safeT('minPrice')}
          value={filters[fromKey] as string}
          onChange={(e) => handleChange(fromKey, e.target.value as QuadFiltersState[typeof fromKey])}
          className="flex-1"
        />
        <Input
          type="number"
          placeholder={safeT('maxPrice')}
          value={filters[toKey] as string}
          onChange={(e) => handleChange(toKey, e.target.value as QuadFiltersState[typeof toKey])}
          className="flex-1"
        />
      </div>
    </div>
  );

  const renderYearSelect = (label: string, value: string, onChange: (val: string) => void) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="any">{safeT('all')}</SelectItem>
        {yearOptions.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm">{safeT('quadFilters.title')}</h4>

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.type')}</Label>
        <div className="space-y-2">
          {quadTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`quad-type-${type.id}`}
                checked={filters[`type${type.id.charAt(0).toUpperCase() + type.id.slice(1)}` as keyof QuadFiltersState] as boolean}
                onCheckedChange={(checked) =>
                  handleChange(`type${type.id.charAt(0).toUpperCase() + type.id.slice(1)}` as keyof QuadFiltersState, checked as boolean)
                }
              />
              <Label htmlFor={`quad-type-${type.id}`} className="text-sm font-normal cursor-pointer">
                {safeT(type.translationKey)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.brand')}</Label>
        <Input
          placeholder={safeT('quadFilters.brandPlaceholder')}
          value={filters.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
        />
      </div>

      {/* Origin Country */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.originCountry')}</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {quadOriginCountries.map((country) => (
            <div key={country.id} className="flex items-center space-x-2">
              <Checkbox
                id={`quad-origin-${country.id}`}
                checked={filters.originCountries.includes(country.id)}
                onCheckedChange={(checked) => handleOriginCountryToggle(country.id, checked as boolean)}
              />
              <Label htmlFor={`quad-origin-${country.id}`} className="text-sm font-normal cursor-pointer">
                {safeT(country.translationKey)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.year')}</Label>
        <div className="flex gap-2">
          {renderYearSelect(safeT('minPrice'), filters.yearFrom, (val) => handleChange('yearFrom', val === 'any' ? '' : val))}
          {renderYearSelect(safeT('maxPrice'), filters.yearTo, (val) => handleChange('yearTo', val === 'any' ? '' : val))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.condition')}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={(value) => handleChange('condition', value as QuadFiltersState['condition'])}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="quad-condition-all" />
            <Label htmlFor="quad-condition-all" className="text-sm font-normal cursor-pointer">
              {safeT('quadFilters.conditionAll')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="quad-condition-new" />
            <Label htmlFor="quad-condition-new" className="text-sm font-normal cursor-pointer">
              {safeT('quadFilters.conditionNew')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="quad-condition-used" />
            <Label htmlFor="quad-condition-used" className="text-sm font-normal cursor-pointer">
              {safeT('quadFilters.conditionUsed')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="for_parts" id="quad-condition-parts" />
            <Label htmlFor="quad-condition-parts" className="text-sm font-normal cursor-pointer">
              {safeT('quadFilters.conditionForParts')}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Engine Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.engineType')}</Label>
        <div className="space-y-2">
          {quadEngineTypes.map((engine) => (
            <div key={engine.id} className="flex items-center space-x-2">
              <Checkbox
                id={`quad-engine-${engine.id}`}
                checked={filters[`engine${engine.id.charAt(0).toUpperCase() + engine.id.slice(1)}` as keyof QuadFiltersState] as boolean}
                onCheckedChange={(checked) =>
                  handleChange(`engine${engine.id.charAt(0).toUpperCase() + engine.id.slice(1)}` as keyof QuadFiltersState, checked as boolean)
                }
              />
              <Label htmlFor={`quad-engine-${engine.id}`} className="text-sm font-normal cursor-pointer">
                {safeT(engine.translationKey)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Engine Volume */}
      {renderRangeInputs(`${safeT('quadFilters.engineVolume')} (${safeT('carFilters.cc')})`, 'engineVolumeFrom', 'engineVolumeTo')}

      {/* Power */}
      {renderRangeInputs(`${safeT('quadFilters.power')} (${safeT('units.hp')})`, 'powerFrom', 'powerTo')}

      {/* Mileage */}
      {renderRangeInputs(`${safeT('quadFilters.mileage')} (${safeT('units.km')})`, 'mileageFrom', 'mileageTo')}

      {/* Max Passengers */}
      {renderRangeInputs(safeT('quadFilters.maxPassengers'), 'maxPassengersFrom', 'maxPassengersTo')}

      {/* Description Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.descriptionSearch')}</Label>
        <Input
          placeholder={safeT('quadFilters.descriptionSearchPlaceholder')}
          value={filters.descriptionSearch}
          onChange={(e) => handleChange('descriptionSearch', e.target.value)}
        />
      </div>
    </div>
  );
}
