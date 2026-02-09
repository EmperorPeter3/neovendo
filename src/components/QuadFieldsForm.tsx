import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { quadTypes, quadOriginCountries, quadConditions, quadEngineTypes, getYearOptions } from '@/data/quadData';

export interface QuadFieldsData {
  type: string;
  brand: string;
  originCountry: string;
  year: string;
  condition: string;
  engineType: string;
  engineVolume: string;
  power: string;
  powerWatt: string;
  mileage: string;
  maxPassengers: string;
}

export const defaultQuadFields: QuadFieldsData = {
  type: '',
  brand: '',
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

interface QuadFieldsFormProps {
  data: QuadFieldsData;
  onChange: (data: QuadFieldsData) => void;
  fieldErrors?: Record<string, boolean>;
  onClearError?: (field: string) => void;
}

export function QuadFieldsForm({ data, onChange, fieldErrors = {}, onClearError }: QuadFieldsFormProps) {
  const { t } = useLanguage();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const safeT = (key: string): string => {
    return t(key as TranslationKey);
  };

  const handleChange = <K extends keyof QuadFieldsData>(key: K, value: QuadFieldsData[K]) => {
    onChange({ ...data, [key]: value });
    if (onClearError && fieldErrors[key]) {
      onClearError(key);
    }
  };

  const getInputClass = (field: string) => {
    return fieldErrors[field] ? 'border-destructive ring-destructive' : '';
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
      <h3 className="font-medium text-sm">{safeT('quadFilters.title')}</h3>

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.type')}</Label>
        <Select value={data.type} onValueChange={(val) => handleChange('type', val)}>
          <SelectTrigger className={getInputClass('type')}>
            <SelectValue placeholder={safeT('filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {quadTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {safeT(type.translationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.brand')}</Label>
        <Input
          placeholder={safeT('quadFilters.brandPlaceholder')}
          value={data.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className={getInputClass('brand')}
        />
      </div>

      {/* Origin Country */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.originCountry')}</Label>
        <Select value={data.originCountry} onValueChange={(val) => handleChange('originCountry', val)}>
          <SelectTrigger className={getInputClass('originCountry')}>
            <SelectValue placeholder={safeT('filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {quadOriginCountries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {safeT(country.translationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.year')}</Label>
        <Select value={data.year} onValueChange={(val) => handleChange('year', val)}>
          <SelectTrigger className={getInputClass('year')}>
            <SelectValue placeholder={safeT('filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.condition')}</Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(value) => handleChange('condition', value)}
          className="flex flex-wrap gap-4"
        >
          {quadConditions.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <RadioGroupItem value={condition.id} id={`quad-form-condition-${condition.id}`} />
              <Label htmlFor={`quad-form-condition-${condition.id}`} className="text-sm font-normal cursor-pointer">
                {safeT(condition.translationKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Engine Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.engineType')}</Label>
        <Select value={data.engineType} onValueChange={(val) => handleChange('engineType', val)}>
          <SelectTrigger className={getInputClass('engineType')}>
            <SelectValue placeholder={safeT('filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {quadEngineTypes.map((engine) => (
              <SelectItem key={engine.id} value={engine.id}>
                {safeT(engine.translationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Engine Volume */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.engineVolume')} (cm³)</Label>
        <Input
          type="number"
          placeholder="0"
          value={data.engineVolume}
          onChange={(e) => handleChange('engineVolume', e.target.value)}
          className={getInputClass('engineVolume')}
        />
      </div>

      {/* Power HP & Power Watt */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT('powerHp')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.power}
            onChange={(e) => handleChange('power', e.target.value)}
            className={getInputClass('power')}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT('powerWatt')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.powerWatt}
            onChange={(e) => handleChange('powerWatt', e.target.value)}
            className={getInputClass('powerWatt')}
          />
        </div>
      </div>

      {/* Mileage */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.mileage')} ({safeT('units.km')})</Label>
        <Input
          type="number"
          placeholder="0"
          value={data.mileage}
          onChange={(e) => handleChange('mileage', e.target.value)}
          className={getInputClass('mileage')}
        />
      </div>

      {/* Max Passengers */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT('quadFilters.maxPassengers')}</Label>
        <Input
          type="number"
          placeholder="0"
          value={data.maxPassengers}
          onChange={(e) => handleChange('maxPassengers', e.target.value)}
          className={getInputClass('maxPassengers')}
        />
      </div>
    </div>
  );
}

export default QuadFieldsForm;
