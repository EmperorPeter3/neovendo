import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { atvTypes, atvOriginCountries, atvConditions, atvEngineTypes, getYearOptions } from '@/data/atvData';
import { TranslationKey } from '@/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface AtvFiltersState {
  // Type filter (checkboxes)
  typeTracked: boolean;
  typeWheeled: boolean;
  typeHomemade: boolean;
  // Brand (text input)
  brand: string;
  // Origin country (checkboxes)
  originCountries: string[];
  // Year range
  yearFrom: string;
  yearTo: string;
  // Condition
  condition: 'all' | 'new' | 'used' | 'for_parts';
  // Engine
  enginePetrol: boolean;
  engineDiesel: boolean;
  engineElectric: boolean;
  // Engine volume range
  engineVolumeFrom: string;
  engineVolumeTo: string;
  // Power range (hp)
  powerFrom: string;
  powerTo: string;
  // Power range (W)
  powerWattFrom: string;
  powerWattTo: string;
  // Mileage range
  mileageFrom: string;
  mileageTo: string;
  // Max passengers range
  maxPassengersFrom: string;
  maxPassengersTo: string;
  // Description search
  descriptionSearch: string;
}

export const defaultAtvFilters: AtvFiltersState = {
  typeTracked: false,
  typeWheeled: false,
  typeHomemade: false,
  brand: '',
  originCountries: [],
  yearFrom: '',
  yearTo: '',
  condition: 'all',
  enginePetrol: false,
  engineDiesel: false,
  engineElectric: false,
  engineVolumeFrom: '',
  engineVolumeTo: '',
  powerFrom: '',
  powerTo: '',
  powerWattFrom: '',
  powerWattTo: '',
  mileageFrom: '',
  mileageTo: '',
  maxPassengersFrom: '',
  maxPassengersTo: '',
  descriptionSearch: '',
};

interface AtvFiltersProps {
  filters: AtvFiltersState;
  onChange: (filters: AtvFiltersState) => void;
}

const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function AtvFilters({ filters, onChange }: AtvFiltersProps) {
  const { t } = useLanguage();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const toggleOriginCountry = (countryId: string) => {
    const newCountries = filters.originCountries.includes(countryId)
      ? filters.originCountries.filter(c => c !== countryId)
      : [...filters.originCountries, countryId];
    onChange({ ...filters, originCountries: newCountries });
  };

  const renderRangeInputs = (
    labelKey: string,
    fromValue: string,
    toValue: string,
    fromKey: keyof AtvFiltersState,
    toKey: keyof AtvFiltersState,
    unit?: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {safeT(t, labelKey)}
        {unit && <span className="text-muted-foreground ml-1">({unit})</span>}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder={safeT(t, 'filters.from')}
          value={fromValue}
          onChange={(e) => onChange({ ...filters, [fromKey]: e.target.value })}
          className="h-9"
        />
        <span className="text-muted-foreground">—</span>
        <Input
          type="number"
          placeholder={safeT(t, 'filters.to')}
          value={toValue}
          onChange={(e) => onChange({ ...filters, [toKey]: e.target.value })}
          className="h-9"
        />
      </div>
    </div>
  );

  const renderYearSelect = (
    value: string,
    onValueChange: (value: string) => void,
    placeholder: string
  ) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="any">{safeT(t, 'filters.any')}</SelectItem>
        {yearOptions.map(year => (
          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4">
      {/* Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.type')}</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="atv-type-tracked" 
              checked={filters.typeTracked} 
              onCheckedChange={(checked) => onChange({ ...filters, typeTracked: !!checked })} 
            />
            <Label htmlFor="atv-type-tracked" className="font-normal cursor-pointer">
              {safeT(t, 'atvFilters.typeTracked')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="atv-type-wheeled" 
              checked={filters.typeWheeled} 
              onCheckedChange={(checked) => onChange({ ...filters, typeWheeled: !!checked })} 
            />
            <Label htmlFor="atv-type-wheeled" className="font-normal cursor-pointer">
              {safeT(t, 'atvFilters.typeWheeled')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="atv-type-homemade" 
              checked={filters.typeHomemade} 
              onCheckedChange={(checked) => onChange({ ...filters, typeHomemade: !!checked })} 
            />
            <Label htmlFor="atv-type-homemade" className="font-normal cursor-pointer">
              {safeT(t, 'atvFilters.typeHomemade')}
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.brand')}</Label>
        <Input
          type="text"
          placeholder={safeT(t, 'atvFilters.brandPlaceholder')}
          value={filters.brand}
          onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          className="h-9"
        />
      </div>

      <Separator />

      {/* Origin Country */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.originCountry')}</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {atvOriginCountries.map(country => (
            <div key={country.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`origin-${country.id}`} 
                checked={filters.originCountries.includes(country.id)} 
                onCheckedChange={() => toggleOriginCountry(country.id)} 
              />
              <Label htmlFor={`origin-${country.id}`} className="font-normal cursor-pointer text-sm">
                {safeT(t, country.translationKey)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.year')}</Label>
        <div className="flex items-center gap-2">
          {renderYearSelect(filters.yearFrom, (v) => onChange({ ...filters, yearFrom: v === 'any' ? '' : v }), safeT(t, 'filters.from'))}
          <span className="text-muted-foreground">—</span>
          {renderYearSelect(filters.yearTo, (v) => onChange({ ...filters, yearTo: v === 'any' ? '' : v }), safeT(t, 'filters.to'))}
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.condition')}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={(value) => onChange({ ...filters, condition: value as AtvFiltersState['condition'] })}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="atv-condition-all" />
            <Label htmlFor="atv-condition-all" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.conditionAll')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="atv-condition-new" />
            <Label htmlFor="atv-condition-new" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.conditionNew')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="atv-condition-used" />
            <Label htmlFor="atv-condition-used" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.conditionUsed')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="for_parts" id="atv-condition-parts" />
            <Label htmlFor="atv-condition-parts" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.conditionForParts')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Mileage - right after condition, hidden when new */}
      {filters.condition !== 'new' && (
        <>
          {renderRangeInputs('atvFilters.mileage', filters.mileageFrom, filters.mileageTo, 'mileageFrom', 'mileageTo', safeT(t, 'units.km'))}
        </>
      )}

      <Separator />

      {/* Engine Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.engineType')}</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="atv-engine-petrol" 
              checked={filters.enginePetrol} 
              onCheckedChange={(checked) => onChange({ ...filters, enginePetrol: !!checked })} 
            />
            <Label htmlFor="atv-engine-petrol" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.enginePetrol')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="atv-engine-diesel" 
              checked={filters.engineDiesel} 
              onCheckedChange={(checked) => onChange({ ...filters, engineDiesel: !!checked })} 
            />
            <Label htmlFor="atv-engine-diesel" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.engineDiesel')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="atv-engine-electric" 
              checked={filters.engineElectric} 
              onCheckedChange={(checked) => onChange({ ...filters, engineElectric: !!checked })} 
            />
            <Label htmlFor="atv-engine-electric" className="font-normal cursor-pointer">{safeT(t, 'atvFilters.engineElectric')}</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Engine Volume */}
      {renderRangeInputs('atvFilters.engineVolume', filters.engineVolumeFrom, filters.engineVolumeTo, 'engineVolumeFrom', 'engineVolumeTo', 'cc')}

      {/* Power (hp) */}
      {renderRangeInputs('atvFilters.power', filters.powerFrom, filters.powerTo, 'powerFrom', 'powerTo', safeT(t, 'units.hp'))}

      {/* Power (W) */}
      {renderRangeInputs('powerWatt', filters.powerWattFrom, filters.powerWattTo, 'powerWattFrom', 'powerWattTo', safeT(t, 'units.watt'))}

      <Separator />

      {/* Max Passengers */}
      {renderRangeInputs('atvFilters.maxPassengers', filters.maxPassengersFrom, filters.maxPassengersTo, 'maxPassengersFrom', 'maxPassengersTo')}

      <Separator />

      {/* Description Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.descriptionSearch')}</Label>
        <Input
          type="text"
          placeholder={safeT(t, 'atvFilters.descriptionSearchPlaceholder')}
          value={filters.descriptionSearch}
          onChange={(e) => onChange({ ...filters, descriptionSearch: e.target.value })}
          className="h-9"
        />
      </div>
    </div>
  );
}

export { defaultAtvFilters as defaultAtvFiltersState };
