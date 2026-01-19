import { useLanguage } from '@/contexts/LanguageContext';
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
import { mopedTypes, mopedOriginCountries, mopedConditions, mopedEngineTypes } from '@/data/mopedData';
import { TranslationKey } from '@/i18n/translations';

export interface MopedFieldsData {
  type: string;
  brand: string;
  originCountry: string;
  year: string;
  condition: string;
  engineType: string;
  engineVolume: string;
  power: string;
  mileage: string;
}

export const defaultMopedFields: MopedFieldsData = {
  type: '',
  brand: '',
  originCountry: '',
  year: '',
  condition: '',
  engineType: '',
  engineVolume: '',
  power: '',
  mileage: '',
};

interface MopedFieldsFormProps {
  data: MopedFieldsData;
  onChange: (data: MopedFieldsData) => void;
  fieldErrors?: Record<string, boolean>;
  onClearError?: (field: string) => void;
}

const typeTranslationMap: Record<string, TranslationKey> = {
  'scooter': 'mopedFilters.typeScooter',
  'maxi_scooter': 'mopedFilters.typeMaxiScooter',
  'moped': 'mopedFilters.typeMoped',
  'mini_bike': 'mopedFilters.typeMiniBike',
};

const conditionTranslationMap: Record<string, TranslationKey> = {
  'new': 'mopedFilters.conditionNew',
  'used': 'mopedFilters.conditionUsed',
  'for_parts': 'mopedFilters.conditionForParts',
};

const engineTypeTranslationMap: Record<string, TranslationKey> = {
  'petrol': 'mopedFilters.enginePetrol',
  'electric': 'mopedFilters.engineElectric',
};

const MopedFieldsForm = ({ data, onChange, fieldErrors = {}, onClearError }: MopedFieldsFormProps) => {
  const { t } = useLanguage();

  const updateField = <K extends keyof MopedFieldsData>(
    key: K,
    value: MopedFieldsData[K]
  ) => {
    onChange({ ...data, [key]: value });
    onClearError?.(key);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium text-foreground">{t('mopedFilters.title' as TranslationKey)}</h3>

      {/* Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.type' as TranslationKey)}</Label>
        <Select
          value={data.type}
          onValueChange={(value) => updateField('type', value)}
        >
          <SelectTrigger className={`h-10 ${fieldErrors.mopedType ? 'border-destructive' : ''}`}>
            <SelectValue placeholder={t('mopedFilters.selectType' as TranslationKey)} />
          </SelectTrigger>
          <SelectContent>
            {mopedTypes.map(type => (
              <SelectItem key={type} value={type}>
                {t(typeTranslationMap[type])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.brand' as TranslationKey)}</Label>
        <Input
          value={data.brand}
          onChange={(e) => updateField('brand', e.target.value)}
          placeholder={t('mopedFilters.brandPlaceholder' as TranslationKey)}
          className={`h-10 ${fieldErrors.mopedBrand ? 'border-destructive' : ''}`}
        />
      </div>

      {/* Origin Country */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.originCountry' as TranslationKey)}</Label>
        <Select
          value={data.originCountry}
          onValueChange={(value) => updateField('originCountry', value)}
        >
          <SelectTrigger className={`h-10 ${fieldErrors.mopedOriginCountry ? 'border-destructive' : ''}`}>
            <SelectValue placeholder={t('mopedFilters.selectCountry' as TranslationKey)} />
          </SelectTrigger>
          <SelectContent>
            {mopedOriginCountries.map(country => (
              <SelectItem key={country} value={country}>
                {t(`countries.${country}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.year' as TranslationKey)}</Label>
        <Select
          value={data.year}
          onValueChange={(value) => updateField('year', value)}
        >
          <SelectTrigger className={`h-10 ${fieldErrors.mopedYear ? 'border-destructive' : ''}`}>
            <SelectValue placeholder={t('mopedFilters.selectYear' as TranslationKey)} />
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

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('mopedFilters.condition' as TranslationKey)}</Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(value) => updateField('condition', value)}
          className="flex flex-wrap gap-4"
        >
          {mopedConditions.map(condition => (
            <div key={condition} className="flex items-center gap-2">
              <RadioGroupItem value={condition} id={`moped-cond-${condition}`} />
              <label htmlFor={`moped-cond-${condition}`} className="text-sm cursor-pointer">
                {t(conditionTranslationMap[condition])}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Engine Type */}
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('mopedFilters.engineType' as TranslationKey)}</Label>
        <RadioGroup
          value={data.engineType}
          onValueChange={(value) => updateField('engineType', value)}
          className="flex flex-wrap gap-4"
        >
          {mopedEngineTypes.map(engineType => (
            <div key={engineType} className="flex items-center gap-2">
              <RadioGroupItem value={engineType} id={`moped-engine-${engineType}`} />
              <label htmlFor={`moped-engine-${engineType}`} className="text-sm cursor-pointer">
                {t(engineTypeTranslationMap[engineType])}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Engine Volume */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.engineVolume' as TranslationKey)} (cc)</Label>
        <Input
          type="number"
          value={data.engineVolume}
          onChange={(e) => updateField('engineVolume', e.target.value)}
          placeholder="50-1000"
          min="0"
          max="20000"
          className={`h-10 ${fieldErrors.mopedEngineVolume ? 'border-destructive' : ''}`}
        />
      </div>

      {/* Power */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.power' as TranslationKey)} (hp)</Label>
        <Input
          type="number"
          value={data.power}
          onChange={(e) => updateField('power', e.target.value)}
          placeholder="1-100"
          min="0"
          max="10000"
          className={`h-10 ${fieldErrors.mopedPower ? 'border-destructive' : ''}`}
        />
      </div>

      {/* Mileage */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('mopedFilters.mileage' as TranslationKey)} (km)</Label>
        <Input
          type="number"
          value={data.mileage}
          onChange={(e) => updateField('mileage', e.target.value)}
          placeholder="0"
          min="0"
          className={`h-10 ${fieldErrors.mopedMileage ? 'border-destructive' : ''}`}
        />
      </div>
    </div>
  );
};

export default MopedFieldsForm;
