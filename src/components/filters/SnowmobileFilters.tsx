import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { snowmobileTypes, snowmobileOriginCountries, snowmobileConditions, snowmobileEngineTypes, getYearOptions } from '@/data/snowmobileData';
import { TranslationKey } from '@/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SnowmobileFiltersState {
  typeUtility: boolean;
  typeSportMountain: boolean;
  typeTouring: boolean;
  typeKids: boolean;
  typeMotobuksir: boolean;
  brand: string;
  originCountries: string[];
  yearFrom: string;
  yearTo: string;
  condition: 'all' | 'new' | 'used' | 'for_parts';
  enginePetrol: boolean;
  engineElectric: boolean;
  engineVolumeFrom: string;
  engineVolumeTo: string;
  powerFrom: string;
  powerTo: string;
  powerWattFrom: string;
  powerWattTo: string;
  mileageFrom: string;
  mileageTo: string;
  maxPassengersFrom: string;
  maxPassengersTo: string;
  trackWidthFrom: string;
  trackWidthTo: string;
  descriptionSearch: string;
}

export const defaultSnowmobileFilters: SnowmobileFiltersState = {
  typeUtility: false,
  typeSportMountain: false,
  typeTouring: false,
  typeKids: false,
  typeMotobuksir: false,
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
  powerWattFrom: '',
  powerWattTo: '',
  mileageFrom: '',
  mileageTo: '',
  maxPassengersFrom: '',
  maxPassengersTo: '',
  trackWidthFrom: '',
  trackWidthTo: '',
  descriptionSearch: '',
};

interface SnowmobileFiltersProps {
  filters: SnowmobileFiltersState;
  onChange: (filters: SnowmobileFiltersState) => void;
}

const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function SnowmobileFilters({ filters, onChange }: SnowmobileFiltersProps) {
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
    fromKey: keyof SnowmobileFiltersState,
    toKey: keyof SnowmobileFiltersState,
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
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.type')}</Label>
        <div className="space-y-2">
          {[
            { key: 'typeUtility' as const, label: 'snowmobileFilters.typeUtility' },
            { key: 'typeSportMountain' as const, label: 'snowmobileFilters.typeSportMountain' },
            { key: 'typeTouring' as const, label: 'snowmobileFilters.typeTouring' },
            { key: 'typeKids' as const, label: 'snowmobileFilters.typeKids' },
            { key: 'typeMotobuksir' as const, label: 'snowmobileFilters.typeMotobuksir' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`snow-type-${key}`}
                checked={filters[key]}
                onCheckedChange={(checked) => onChange({ ...filters, [key]: !!checked })}
              />
              <Label htmlFor={`snow-type-${key}`} className="font-normal cursor-pointer">
                {safeT(t, label)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.brand')}</Label>
        <Input
          type="text"
          placeholder={safeT(t, 'snowmobileFilters.brandPlaceholder')}
          value={filters.brand}
          onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          className="h-9"
        />
      </div>

      <Separator />

      {/* Origin Country */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.originCountry')}</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {snowmobileOriginCountries.map(country => (
            <div key={country.id} className="flex items-center space-x-2">
              <Checkbox
                id={`snow-origin-${country.id}`}
                checked={filters.originCountries.includes(country.id)}
                onCheckedChange={() => toggleOriginCountry(country.id)}
              />
              <Label htmlFor={`snow-origin-${country.id}`} className="font-normal cursor-pointer text-sm">
                {safeT(t, country.translationKey)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.year')}</Label>
        <div className="flex items-center gap-2">
          {renderYearSelect(filters.yearFrom, (v) => onChange({ ...filters, yearFrom: v === 'any' ? '' : v }), safeT(t, 'filters.from'))}
          <span className="text-muted-foreground">—</span>
          {renderYearSelect(filters.yearTo, (v) => onChange({ ...filters, yearTo: v === 'any' ? '' : v }), safeT(t, 'filters.to'))}
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.condition')}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={(value) => onChange({ ...filters, condition: value as SnowmobileFiltersState['condition'] })}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="snow-condition-all" />
            <Label htmlFor="snow-condition-all" className="font-normal cursor-pointer">{safeT(t, 'snowmobileFilters.conditionAll')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="snow-condition-new" />
            <Label htmlFor="snow-condition-new" className="font-normal cursor-pointer">{safeT(t, 'snowmobileFilters.conditionNew')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="snow-condition-used" />
            <Label htmlFor="snow-condition-used" className="font-normal cursor-pointer">{safeT(t, 'snowmobileFilters.conditionUsed')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="for_parts" id="snow-condition-parts" />
            <Label htmlFor="snow-condition-parts" className="font-normal cursor-pointer">{safeT(t, 'snowmobileFilters.conditionForParts')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Mileage - right after condition, hidden when new */}
      {filters.condition !== 'new' && (
        <>
          {renderRangeInputs('snowmobileFilters.mileage', filters.mileageFrom, filters.mileageTo, 'mileageFrom', 'mileageTo', safeT(t, 'units.km'))}
        </>
      )}

      <Separator />

      {/* Engine Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.engineType')}</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="snow-engine-petrol"
              checked={filters.enginePetrol}
              onCheckedChange={(checked) => onChange({ ...filters, enginePetrol: !!checked })}
            />
            <Label htmlFor="snow-engine-petrol" className="font-normal cursor-pointer">{safeT(t, 'snowmobileFilters.enginePetrol')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="snow-engine-electric"
              checked={filters.engineElectric}
              onCheckedChange={(checked) => onChange({ ...filters, engineElectric: !!checked })}
            />
            <Label htmlFor="snow-engine-electric" className="font-normal cursor-pointer">{safeT(t, 'snowmobileFilters.engineElectric')}</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Engine Volume */}
      {renderRangeInputs('snowmobileFilters.engineVolume', filters.engineVolumeFrom, filters.engineVolumeTo, 'engineVolumeFrom', 'engineVolumeTo', 'cc')}

      {/* Power (hp) */}
      {renderRangeInputs('snowmobileFilters.power', filters.powerFrom, filters.powerTo, 'powerFrom', 'powerTo', safeT(t, 'units.hp'))}

      {/* Power (W) */}
      {renderRangeInputs('powerWatt', filters.powerWattFrom, filters.powerWattTo, 'powerWattFrom', 'powerWattTo', safeT(t, 'units.watt'))}

      <Separator />

      {/* Max Passengers */}
      {renderRangeInputs('snowmobileFilters.maxPassengers', filters.maxPassengersFrom, filters.maxPassengersTo, 'maxPassengersFrom', 'maxPassengersTo')}

      {/* Track Width */}
      {renderRangeInputs('snowmobileFilters.trackWidth', filters.trackWidthFrom, filters.trackWidthTo, 'trackWidthFrom', 'trackWidthTo', safeT(t, 'units.mm'))}

      <Separator />

      {/* Description Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'snowmobileFilters.descriptionSearch')}</Label>
        <Input
          type="text"
          placeholder={safeT(t, 'snowmobileFilters.descriptionSearchPlaceholder')}
          value={filters.descriptionSearch}
          onChange={(e) => onChange({ ...filters, descriptionSearch: e.target.value })}
          className="h-9"
        />
      </div>
    </div>
  );
}
