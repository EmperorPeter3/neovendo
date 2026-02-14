import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { atvTypes, atvOriginCountries, atvConditions, atvEngineTypes, getYearOptions } from '@/data/atvData';
import { TranslationKey } from '@/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface AtvFieldsData {
  type: string;
  brand: string;
  model: string;
  originCountry: string;
  year: string;
  condition: 'new' | 'used' | 'for_parts' | '';
  engineType: string;
  engineVolume: string;
  power: string;
  powerWatt: string;
  mileage: string;
  maxPassengers: string;
}

export const defaultAtvFields: AtvFieldsData = {
  type: '',
  brand: '',
  model: '',
  originCountry: '',
  year: '',
  condition: '',
  engineType: '',
  engineVolume: '',
  power: '',
  powerWatt: '',
  mileage: '',
  maxPassengers: '',
};

interface AtvFieldsFormProps {
  data: AtvFieldsData;
  onChange: (data: AtvFieldsData) => void;
  fieldErrors?: Record<string, boolean>;
  onClearError?: (field: string) => void;
}

const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function AtvFieldsForm({ data, onChange, fieldErrors = {}, onClearError }: AtvFieldsFormProps) {
  const { t } = useLanguage();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const handleChange = <K extends keyof AtvFieldsData>(key: K, value: AtvFieldsData[K]) => {
    onChange({ ...data, [key]: value });
    onClearError?.(key);
  };

  const getInputClass = (field: string) => fieldErrors[field] ? 'border-destructive ring-destructive' : '';

  return (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h3 className="font-semibold text-foreground">{safeT(t, 'atvFilters.title')}</h3>

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.type')}</Label>
        <Select value={data.type} onValueChange={(v) => handleChange('type', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {atvTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{safeT(t, type.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.brand')}</Label>
        <Input
          type="text"
          placeholder={safeT(t, 'atvFilters.brandPlaceholder')}
          value={data.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
        />
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'model')}</Label>
        <Input
          type="text"
          placeholder={safeT(t, 'enterModel')}
          value={data.model}
          onChange={(e) => handleChange('model', e.target.value)}
        />
      </div>

      {/* Origin Country */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.originCountry')}</Label>
        <Select value={data.originCountry} onValueChange={(v) => handleChange('originCountry', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {atvOriginCountries.map(country => (
              <SelectItem key={country.id} value={country.id}>{safeT(t, country.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.year')}</Label>
        <Select value={data.year} onValueChange={(v) => handleChange('year', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.condition')}</Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(value) => handleChange('condition', value as AtvFieldsData['condition'])}
          className="flex flex-wrap gap-4"
        >
          {atvConditions.map(condition => (
            <div key={condition.id} className="flex items-center space-x-2">
              <RadioGroupItem value={condition.id} id={`atv-form-condition-${condition.id}`} />
              <Label htmlFor={`atv-form-condition-${condition.id}`} className="font-normal cursor-pointer">
                {safeT(t, condition.translationKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Mileage - after condition, hidden when new */}
      {data.condition !== 'new' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {safeT(t, 'atvFilters.mileage')}
            <span className="text-muted-foreground ml-1">({safeT(t, 'units.km')})</span>
          </Label>
          <Input
            type="number"
            placeholder="0"
            value={data.mileage}
            onChange={(e) => handleChange('mileage', e.target.value)}
            min="0"
            className={getInputClass('mileage')}
          />
        </div>
      )}

      {/* Engine Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.engineType')}</Label>
        <Select value={data.engineType} onValueChange={(v) => handleChange('engineType', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {atvEngineTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{safeT(t, type.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Engine Volume */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {safeT(t, 'atvFilters.engineVolume')}
          <span className="text-muted-foreground ml-1">(cm³)</span>
        </Label>
        <Input
          type="number"
          placeholder="0"
          value={data.engineVolume}
          onChange={(e) => handleChange('engineVolume', e.target.value)}
          min="0"
          className={getInputClass('engineVolume')}
        />
      </div>

      {/* Power HP & Power Watt */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'powerHp')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.power}
            onChange={(e) => handleChange('power', e.target.value)}
            min="0"
            className={getInputClass('power')}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'powerWatt')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.powerWatt}
            onChange={(e) => handleChange('powerWatt', e.target.value)}
            min="0"
            className={getInputClass('powerWatt')}
          />
        </div>
      </div>

      {/* Max Passengers */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'atvFilters.maxPassengers')}</Label>
        <Input
          type="number"
          placeholder="1"
          value={data.maxPassengers}
          onChange={(e) => handleChange('maxPassengers', e.target.value)}
          min="1"
          max="20"
        />
      </div>
    </div>
  );
}
