import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mopedTypes, mopedOriginCountries, mopedEngineTypes } from '@/data/mopedData';
import { TranslationKey } from '@/i18n/translations';

export interface MopedFiltersState {
  // Type checkboxes
  typeScooter: boolean;
  typeMaxiScooter: boolean;
  typeMoped: boolean;
  typeMiniBike: boolean;
  // Brand text input
  brand: string;
  // Origin countries multi-select
  originCountries: string[];
  // Year range
  yearFrom: string;
  yearTo: string;
  // Condition
  condition: 'all' | 'new' | 'used' | 'for_parts';
  // Engine type checkboxes
  enginePetrol: boolean;
  engineElectric: boolean;
  // Engine volume range (cc)
  engineVolumeFrom: string;
  engineVolumeTo: string;
  // Power range (hp)
  powerFrom: string;
  powerTo: string;
  // Power range (W)
  powerWattFrom: string;
  powerWattTo: string;
  // Mileage range (km)
  mileageFrom: string;
  mileageTo: string;
  // Description search
  descriptionSearch: string;
}

export const defaultMopedFilters: MopedFiltersState = {
  typeScooter: false,
  typeMaxiScooter: false,
  typeMoped: false,
  typeMiniBike: false,
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
  descriptionSearch: '',
};

interface MopedFiltersProps {
  filters: MopedFiltersState;
  onChange: (filters: MopedFiltersState) => void;
}

export const MopedFilters = ({ filters, onChange }: MopedFiltersProps) => {
  const { t } = useLanguage();

  const updateFilter = <K extends keyof MopedFiltersState>(
    key: K,
    value: MopedFiltersState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleOriginCountry = (country: string) => {
    const current = filters.originCountries;
    if (current.includes(country)) {
      updateFilter('originCountries', current.filter(c => c !== country));
    } else {
      updateFilter('originCountries', [...current, country]);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const typeMap: Record<string, keyof MopedFiltersState> = {
    'scooter': 'typeScooter',
    'maxi_scooter': 'typeMaxiScooter',
    'moped': 'typeMoped',
    'mini_bike': 'typeMiniBike',
  };

  const typeTranslationMap: Record<string, TranslationKey> = {
    'scooter': 'mopedFilters.typeScooter',
    'maxi_scooter': 'mopedFilters.typeMaxiScooter',
    'moped': 'mopedFilters.typeMoped',
    'mini_bike': 'mopedFilters.typeMiniBike',
  };

  return (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('mopedFilters.type' as TranslationKey)}</Label>
        <div className="space-y-2">
          {mopedTypes.map(type => {
            const checkboxKey = typeMap[type];
            return (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`moped-type-${type}`}
                  checked={filters[checkboxKey] as boolean}
                  onCheckedChange={(checked) => updateFilter(checkboxKey, !!checked)}
                />
                <label htmlFor={`moped-type-${type}`} className="text-sm cursor-pointer">
                  {t(typeTranslationMap[type])}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.brand' as TranslationKey)}</Label>
        <Input
          value={filters.brand}
          onChange={(e) => updateFilter('brand', e.target.value)}
          placeholder={t('mopedFilters.brandPlaceholder' as TranslationKey)}
          className="h-10"
        />
      </div>

      {/* Origin Country */}
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('mopedFilters.originCountry' as TranslationKey)}</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mopedOriginCountries.map(country => (
            <div key={country} className="flex items-center gap-2">
              <Checkbox
                id={`moped-origin-${country}`}
                checked={filters.originCountries.includes(country)}
                onCheckedChange={() => toggleOriginCountry(country)}
              />
              <label htmlFor={`moped-origin-${country}`} className="text-sm cursor-pointer">
                {t(`countries.${country}` as TranslationKey)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.yearRange' as TranslationKey)}</Label>
        <div className="flex gap-2">
          <Select
            value={filters.yearFrom}
            onValueChange={(value) => updateFilter('yearFrom', value)}
          >
            <SelectTrigger className="flex-1 h-10">
              <SelectValue placeholder={t('mopedFilters.from' as TranslationKey)} />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.yearTo}
            onValueChange={(value) => updateFilter('yearTo', value)}
          >
            <SelectTrigger className="flex-1 h-10">
              <SelectValue placeholder={t('mopedFilters.to' as TranslationKey)} />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('mopedFilters.condition' as TranslationKey)}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={(value) => updateFilter('condition', value as MopedFiltersState['condition'])}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="moped-condition-all" />
            <label htmlFor="moped-condition-all" className="text-sm cursor-pointer">
              {t('mopedFilters.conditionAll' as TranslationKey)}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="new" id="moped-condition-new" />
            <label htmlFor="moped-condition-new" className="text-sm cursor-pointer">
              {t('mopedFilters.conditionNew' as TranslationKey)}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="used" id="moped-condition-used" />
            <label htmlFor="moped-condition-used" className="text-sm cursor-pointer">
              {t('mopedFilters.conditionUsed' as TranslationKey)}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="for_parts" id="moped-condition-parts" />
            <label htmlFor="moped-condition-parts" className="text-sm cursor-pointer">
              {t('mopedFilters.conditionForParts' as TranslationKey)}
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Mileage - right after condition, hidden when new */}
      {filters.condition !== 'new' && (
        <div>
          <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.mileage' as TranslationKey)} (km)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={filters.mileageFrom}
              onChange={(e) => updateFilter('mileageFrom', e.target.value)}
              placeholder={t('mopedFilters.from' as TranslationKey)}
              className="flex-1 h-10"
              min="0"
            />
            <Input
              type="number"
              value={filters.mileageTo}
              onChange={(e) => updateFilter('mileageTo', e.target.value)}
              placeholder={t('mopedFilters.to' as TranslationKey)}
              className="flex-1 h-10"
              min="0"
            />
          </div>
        </div>
      )}

      {/* Engine Type */}
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('mopedFilters.engineType' as TranslationKey)}</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="moped-engine-petrol"
              checked={filters.enginePetrol}
              onCheckedChange={(checked) => updateFilter('enginePetrol', !!checked)}
            />
            <label htmlFor="moped-engine-petrol" className="text-sm cursor-pointer">
              {t('mopedFilters.enginePetrol' as TranslationKey)}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="moped-engine-electric"
              checked={filters.engineElectric}
              onCheckedChange={(checked) => updateFilter('engineElectric', !!checked)}
            />
            <label htmlFor="moped-engine-electric" className="text-sm cursor-pointer">
              {t('mopedFilters.engineElectric' as TranslationKey)}
            </label>
          </div>
        </div>
      </div>

      {/* Engine Volume Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.engineVolume' as TranslationKey)} (cc)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.engineVolumeFrom}
            onChange={(e) => updateFilter('engineVolumeFrom', e.target.value)}
            placeholder={t('mopedFilters.from' as TranslationKey)}
            className="flex-1 h-10"
            min="0"
            max="20000"
          />
          <Input
            type="number"
            value={filters.engineVolumeTo}
            onChange={(e) => updateFilter('engineVolumeTo', e.target.value)}
            placeholder={t('mopedFilters.to' as TranslationKey)}
            className="flex-1 h-10"
            min="0"
            max="20000"
          />
        </div>
      </div>

      {/* Power Range (hp) */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.power' as TranslationKey)} (hp)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.powerFrom}
            onChange={(e) => updateFilter('powerFrom', e.target.value)}
            placeholder={t('mopedFilters.from' as TranslationKey)}
            className="flex-1 h-10"
            min="0"
          />
          <Input
            type="number"
            value={filters.powerTo}
            onChange={(e) => updateFilter('powerTo', e.target.value)}
            placeholder={t('mopedFilters.to' as TranslationKey)}
            className="flex-1 h-10"
            min="0"
          />
        </div>
      </div>

      {/* Power Range (W) */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('powerWatt' as TranslationKey)}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.powerWattFrom}
            onChange={(e) => updateFilter('powerWattFrom', e.target.value)}
            placeholder={t('mopedFilters.from' as TranslationKey)}
            className="flex-1 h-10"
            min="0"
          />
          <Input
            type="number"
            value={filters.powerWattTo}
            onChange={(e) => updateFilter('powerWattTo', e.target.value)}
            placeholder={t('mopedFilters.to' as TranslationKey)}
            className="flex-1 h-10"
            min="0"
          />
        </div>
      </div>

      {/* Description Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.descriptionSearch' as TranslationKey)}</Label>
        <Input
          value={filters.descriptionSearch}
          onChange={(e) => updateFilter('descriptionSearch', e.target.value)}
          placeholder={t('mopedFilters.descriptionSearchPlaceholder' as TranslationKey)}
          className="h-10"
        />
      </div>
    </div>
  );
};
