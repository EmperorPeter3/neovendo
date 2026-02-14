import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motoTypes, motoOriginCountries, motoFuelDelivery, motoStrokes, motoTransmissions, motoDriveTypes, motoCylinders, motoGears, motoCoolingTypes } from '@/data/motoData';

export interface MotoFiltersState {
  // Types
  typeCruiserChopper: boolean;
  typeSportbike: boolean;
  typeTouring: boolean;
  typeSportTouring: boolean;
  typeTourEnduro: boolean;
  typeTrike: boolean;
  typeNaked: boolean;
  typeMotard: boolean;
  typeEnduro: boolean;
  typeCross: boolean;
  typePitbike: boolean;
  typeTrial: boolean;
  typeKids: boolean;
  typeCustom: boolean;
  brand: string;
  originCountries: string[];
  yearFrom: string;
  yearTo: string;
  condition: 'all' | 'new' | 'used' | 'for_parts';
  enginePetrol: boolean;
  engineElectric: boolean;
  engineVolumeFrom: string;
  engineVolumeTo: string;
  powerHpFrom: string;
  powerHpTo: string;
  powerWattFrom: string;
  powerWattTo: string;
  fuelDelivery: string;
  strokes: string;
  transmission: string[];
  driveType: string[];
  cylinders: string;
  gears: string;
  cooling: string;
  mileageFrom: string;
  mileageTo: string;
  descriptionSearch: string;
}

export const defaultMotoFilters: MotoFiltersState = {
  typeCruiserChopper: false,
  typeSportbike: false,
  typeTouring: false,
  typeSportTouring: false,
  typeTourEnduro: false,
  typeTrike: false,
  typeNaked: false,
  typeMotard: false,
  typeEnduro: false,
  typeCross: false,
  typePitbike: false,
  typeTrial: false,
  typeKids: false,
  typeCustom: false,
  brand: '',
  originCountries: [],
  yearFrom: '',
  yearTo: '',
  condition: 'all',
  enginePetrol: false,
  engineElectric: false,
  engineVolumeFrom: '',
  engineVolumeTo: '',
  powerHpFrom: '',
  powerHpTo: '',
  powerWattFrom: '',
  powerWattTo: '',
  fuelDelivery: '',
  strokes: '',
  transmission: [],
  driveType: [],
  cylinders: '',
  gears: '',
  cooling: '',
  mileageFrom: '',
  mileageTo: '',
  descriptionSearch: '',
};

interface MotoFiltersProps {
  filters: MotoFiltersState;
  onChange: (filters: MotoFiltersState) => void;
}

export const MotoFilters = ({ filters, onChange }: MotoFiltersProps) => {
  const { t } = useLanguage();

  const updateFilter = <K extends keyof MotoFiltersState>(
    key: K,
    value: MotoFiltersState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleOriginCountry = (country: string) => {
    const current = filters.originCountries;
    const updated = current.includes(country)
      ? current.filter(c => c !== country)
      : [...current, country];
    updateFilter('originCountries', updated);
  };

  const toggleTransmission = (trans: string) => {
    const current = filters.transmission;
    const updated = current.includes(trans)
      ? current.filter(t => t !== trans)
      : [...current, trans];
    updateFilter('transmission', updated);
  };

  const toggleDriveType = (dt: string) => {
    const current = filters.driveType;
    const updated = current.includes(dt)
      ? current.filter(d => d !== dt)
      : [...current, dt];
    updateFilter('driveType', updated);
  };

  return (
    <div className="space-y-4">
      {/* Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.type' as TranslationKey)}</Label>
        <div className="grid grid-cols-2 gap-2">
          {motoTypes.map(type => {
            const typeKey = `type${type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}` as keyof MotoFiltersState;
            return (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`moto-type-${type}`}
                  checked={filters[typeKey] as boolean}
                  onCheckedChange={(checked) => updateFilter(typeKey, checked as boolean)}
                />
                <label
                  htmlFor={`moto-type-${type}`}
                  className="text-xs cursor-pointer"
                >
                  {t(`moto.type.${type}` as TranslationKey)}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('brand' as TranslationKey)}</Label>
        <Input
          value={filters.brand}
          onChange={(e) => updateFilter('brand', e.target.value)}
          placeholder={t('enterBrand' as TranslationKey)}
          className="h-9"
        />
      </div>

      {/* Origin Country */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('originCountry' as TranslationKey)}</Label>
        <div className="grid grid-cols-2 gap-2">
          {motoOriginCountries.map(country => (
            <div key={country} className="flex items-center space-x-2">
              <Checkbox
                id={`moto-origin-${country}`}
                checked={filters.originCountries.includes(country)}
                onCheckedChange={() => toggleOriginCountry(country)}
              />
              <label
                htmlFor={`moto-origin-${country}`}
                className="text-xs cursor-pointer"
              >
                {t(`country.${country}` as TranslationKey)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('year' as TranslationKey)}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.yearFrom}
            onChange={(e) => updateFilter('yearFrom', e.target.value)}
            placeholder={t('from' as TranslationKey)}
            className="h-9 flex-1"
          />
          <Input
            type="number"
            value={filters.yearTo}
            onChange={(e) => updateFilter('yearTo', e.target.value)}
            placeholder={t('to' as TranslationKey)}
            className="h-9 flex-1"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('condition' as TranslationKey)}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={(value) => updateFilter('condition', value as MotoFiltersState['condition'])}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="moto-cond-all" />
            <Label htmlFor="moto-cond-all" className="text-xs cursor-pointer">{t('all')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="moto-cond-new" />
            <Label htmlFor="moto-cond-new" className="text-xs cursor-pointer">{t('condition.new' as TranslationKey)}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="moto-cond-used" />
            <Label htmlFor="moto-cond-used" className="text-xs cursor-pointer">{t('condition.used' as TranslationKey)}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="for_parts" id="moto-cond-parts" />
            <Label htmlFor="moto-cond-parts" className="text-xs cursor-pointer">{t('condition.forParts' as TranslationKey)}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Mileage - right after condition, hidden when new */}
      {filters.condition !== 'new' && (
        <div>
          <Label className="text-sm font-medium mb-2 block">{t('mileageKm' as TranslationKey)}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={filters.mileageFrom}
              onChange={(e) => updateFilter('mileageFrom', e.target.value)}
              placeholder={t('from' as TranslationKey)}
              className="h-9 flex-1"
            />
            <Input
              type="number"
              value={filters.mileageTo}
              onChange={(e) => updateFilter('mileageTo', e.target.value)}
              placeholder={t('to' as TranslationKey)}
              className="h-9 flex-1"
            />
          </div>
        </div>
      )}

      {/* Engine Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('engineType' as TranslationKey)}</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="moto-engine-petrol"
              checked={filters.enginePetrol}
              onCheckedChange={(checked) => updateFilter('enginePetrol', checked as boolean)}
            />
            <label htmlFor="moto-engine-petrol" className="text-xs cursor-pointer">
              {t('engine.petrol' as TranslationKey)}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="moto-engine-electric"
              checked={filters.engineElectric}
              onCheckedChange={(checked) => updateFilter('engineElectric', checked as boolean)}
            />
            <label htmlFor="moto-engine-electric" className="text-xs cursor-pointer">
              {t('engine.electric' as TranslationKey)}
            </label>
          </div>
        </div>
      </div>

      {/* Engine Volume */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('engineVolumeCc' as TranslationKey)}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.engineVolumeFrom}
            onChange={(e) => updateFilter('engineVolumeFrom', e.target.value)}
            placeholder={t('from' as TranslationKey)}
            className="h-9 flex-1"
          />
          <Input
            type="number"
            value={filters.engineVolumeTo}
            onChange={(e) => updateFilter('engineVolumeTo', e.target.value)}
            placeholder={t('to' as TranslationKey)}
            className="h-9 flex-1"
          />
        </div>
      </div>

      {/* Power HP */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('powerHp' as TranslationKey)}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.powerHpFrom}
            onChange={(e) => updateFilter('powerHpFrom', e.target.value)}
            placeholder={t('from' as TranslationKey)}
            className="h-9 flex-1"
          />
          <Input
            type="number"
            value={filters.powerHpTo}
            onChange={(e) => updateFilter('powerHpTo', e.target.value)}
            placeholder={t('to' as TranslationKey)}
            className="h-9 flex-1"
          />
        </div>
      </div>

      {/* Power Watt */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('powerWatt' as TranslationKey)}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={filters.powerWattFrom}
            onChange={(e) => updateFilter('powerWattFrom', e.target.value)}
            placeholder={t('from' as TranslationKey)}
            className="h-9 flex-1"
          />
          <Input
            type="number"
            value={filters.powerWattTo}
            onChange={(e) => updateFilter('powerWattTo', e.target.value)}
            placeholder={t('to' as TranslationKey)}
            className="h-9 flex-1"
          />
        </div>
      </div>

      {/* Fuel Delivery */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.fuelDelivery' as TranslationKey)}</Label>
        <Select
          value={filters.fuelDelivery || 'all'}
          onValueChange={(value) => updateFilter('fuelDelivery', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {motoFuelDelivery.map(fd => (
              <SelectItem key={fd} value={fd}>
                {t(`moto.fuelDelivery.${fd}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Strokes */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.strokes' as TranslationKey)}</Label>
        <Select
          value={filters.strokes || 'all'}
          onValueChange={(value) => updateFilter('strokes', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {motoStrokes.map(s => (
              <SelectItem key={s} value={String(s)}>
                {t(`moto.strokes.${s}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('transmission' as TranslationKey)}</Label>
        <div className="flex flex-col space-y-2">
          {motoTransmissions.map(trans => (
            <div key={trans} className="flex items-center space-x-2">
              <Checkbox
                id={`moto-trans-${trans}`}
                checked={filters.transmission.includes(trans)}
                onCheckedChange={() => toggleTransmission(trans)}
              />
              <label htmlFor={`moto-trans-${trans}`} className="text-xs cursor-pointer">
                {t(`transmission.${trans}` as TranslationKey)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Drive Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.driveType' as TranslationKey)}</Label>
        <div className="flex flex-col space-y-2">
          {motoDriveTypes.map(dt => (
            <div key={dt} className="flex items-center space-x-2">
              <Checkbox
                id={`moto-drive-${dt}`}
                checked={filters.driveType.includes(dt)}
                onCheckedChange={() => toggleDriveType(dt)}
              />
              <label htmlFor={`moto-drive-${dt}`} className="text-xs cursor-pointer">
                {t(`moto.driveType.${dt}` as TranslationKey)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Cylinders */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.cylinders' as TranslationKey)}</Label>
        <Select
          value={filters.cylinders || 'all'}
          onValueChange={(value) => updateFilter('cylinders', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {motoCylinders.map(c => (
              <SelectItem key={c} value={String(c)}>{String(c)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gears */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.gears' as TranslationKey)}</Label>
        <Select
          value={filters.gears || 'all'}
          onValueChange={(value) => updateFilter('gears', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {motoGears.map(g => (
              <SelectItem key={g} value={String(g)}>{String(g)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cooling */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.cooling' as TranslationKey)}</Label>
        <Select
          value={filters.cooling || 'all'}
          onValueChange={(value) => updateFilter('cooling', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all')}</SelectItem>
            {motoCoolingTypes.map(ct => (
              <SelectItem key={ct} value={ct}>
                {t(`moto.cooling.${ct}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('descriptionSearch' as TranslationKey)}</Label>
        <Input
          value={filters.descriptionSearch}
          onChange={(e) => updateFilter('descriptionSearch', e.target.value)}
          placeholder={t('enterKeywords' as TranslationKey)}
          className="h-9"
        />
      </div>
    </div>
  );
};

export default MotoFilters;
