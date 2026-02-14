import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
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
import { motoTypes, motoOriginCountries, motoConditions, motoEngineTypes, motoFuelDelivery, motoStrokes, motoTransmissions } from '@/data/motoData';

export interface MotoFieldsData {
  type: string;
  brand: string;
  model: string;
  originCountry: string;
  year: string;
  condition: string;
  engineType: string;
  engineVolume: string;
  powerHp: string;
  powerWatt: string;
  fuelDelivery: string;
  strokes: string;
  transmission: string;
  mileage: string;
}

export const defaultMotoFields: MotoFieldsData = {
  type: '',
  brand: '',
  model: '',
  originCountry: '',
  year: '',
  condition: '',
  engineType: '',
  engineVolume: '',
  powerHp: '',
  powerWatt: '',
  fuelDelivery: '',
  strokes: '',
  transmission: '',
  mileage: '',
};

interface MotoFieldsFormProps {
  data: MotoFieldsData;
  onChange: (data: MotoFieldsData) => void;
  fieldErrors?: Record<string, boolean>;
  onClearError?: (field: string) => void;
}

export const MotoFieldsForm = ({ data, onChange, fieldErrors = {}, onClearError }: MotoFieldsFormProps) => {
  const { t } = useLanguage();

  const updateField = <K extends keyof MotoFieldsData>(key: K, value: MotoFieldsData[K]) => {
    onChange({ ...data, [key]: value });
    if (onClearError) onClearError(key);
  };

  return (
    <div className="space-y-4 border-t border-border pt-4 mt-4">
      <h3 className="font-medium text-foreground">{t('moto.specifications' as TranslationKey)}</h3>

      {/* Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.type' as TranslationKey)}</Label>
        <Select value={data.type} onValueChange={(v) => updateField('type', v)}>
          <SelectTrigger className={`h-12 ${fieldErrors.type ? 'border-destructive ring-destructive' : ''}`}>
            <SelectValue placeholder={t('select' as TranslationKey)} />
          </SelectTrigger>
          <SelectContent>
            {motoTypes.map(type => (
              <SelectItem key={type} value={type}>
                {t(`moto.type.${type}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('brand' as TranslationKey)}</Label>
        <Input
          value={data.brand}
          onChange={(e) => updateField('brand', e.target.value)}
          placeholder={t('enterBrand' as TranslationKey)}
          className={`h-12 ${fieldErrors.brand ? 'border-destructive ring-destructive' : ''}`}
        />
      </div>

      {/* Model */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('model' as TranslationKey)}</Label>
        <Input
          value={data.model}
          onChange={(e) => updateField('model', e.target.value)}
          placeholder={t('enterModel' as TranslationKey)}
          className="h-12"
        />
      </div>

      {/* Origin Country */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('originCountry' as TranslationKey)}</Label>
        <Select value={data.originCountry} onValueChange={(v) => updateField('originCountry', v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder={t('select' as TranslationKey)} />
          </SelectTrigger>
          <SelectContent>
            {motoOriginCountries.map(country => (
              <SelectItem key={country} value={country}>
                {t(`countries.${country}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('year' as TranslationKey)}</Label>
        <Input
          type="number"
          value={data.year}
          onChange={(e) => updateField('year', e.target.value)}
          placeholder="2020"
          min="1900"
          max={new Date().getFullYear() + 1}
          className={`h-12 ${fieldErrors.year ? 'border-destructive ring-destructive' : ''}`}
        />
      </div>

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('condition' as TranslationKey)}</Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(v) => updateField('condition', v)}
          className="flex flex-wrap gap-4"
        >
          {motoConditions.map(cond => (
            <div key={cond} className="flex items-center space-x-2">
              <RadioGroupItem value={cond} id={`moto-cond-${cond}`} />
              <Label htmlFor={`moto-cond-${cond}`} className="text-sm cursor-pointer">
                {t(`condition.${cond === 'for_parts' ? 'forParts' : cond}` as TranslationKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Mileage - after condition, hidden when new */}
      {data.condition !== 'new' && (
        <div>
          <Label className="text-sm font-medium mb-2 block">{t('mileageKm' as TranslationKey)}</Label>
          <Input
            type="number"
            value={data.mileage}
            onChange={(e) => updateField('mileage', e.target.value)}
            placeholder="10000"
            min="0"
            className={`h-12 ${fieldErrors.mileage ? 'border-destructive ring-destructive' : ''}`}
          />
        </div>
      )}

      {/* Engine Type */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('engineType' as TranslationKey)}</Label>
        <RadioGroup
          value={data.engineType}
          onValueChange={(v) => updateField('engineType', v)}
          className="flex flex-wrap gap-4"
        >
          {motoEngineTypes.map(et => (
            <div key={et} className="flex items-center space-x-2">
              <RadioGroupItem value={et} id={`moto-et-${et}`} />
              <Label htmlFor={`moto-et-${et}`} className="text-sm cursor-pointer">
                {t(`engine.${et}` as TranslationKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Engine Volume */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('carFilters.engineVolume' as TranslationKey)}</Label>
        <Input
          type="number"
          value={data.engineVolume}
          onChange={(e) => updateField('engineVolume', e.target.value)}
          placeholder="600"
          min="0"
          max="20000"
          className={`h-12 ${fieldErrors.engineVolume ? 'border-destructive ring-destructive' : ''}`}
        />
      </div>

      {/* Power HP */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('powerHp' as TranslationKey)}</Label>
        <Input
          type="number"
          value={data.powerHp}
          onChange={(e) => updateField('powerHp', e.target.value)}
          placeholder="100"
          min="0"
          max="500"
          className={`h-12 ${fieldErrors.powerHp ? 'border-destructive ring-destructive' : ''}`}
        />
      </div>

      {/* Power Watt */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('powerWatt' as TranslationKey)}</Label>
        <Input
          type="number"
          value={data.powerWatt}
          onChange={(e) => updateField('powerWatt', e.target.value)}
          placeholder="50000"
          min="0"
          className={`h-12 ${fieldErrors.powerWatt ? 'border-destructive ring-destructive' : ''}`}
        />
      </div>

      {/* Fuel Delivery */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('moto.fuelDelivery' as TranslationKey)}</Label>
        <Select value={data.fuelDelivery} onValueChange={(v) => updateField('fuelDelivery', v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder={t('select' as TranslationKey)} />
          </SelectTrigger>
          <SelectContent>
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
        <RadioGroup
          value={data.strokes}
          onValueChange={(v) => updateField('strokes', v)}
          className="flex flex-wrap gap-4"
        >
          {motoStrokes.map(s => (
            <div key={s} className="flex items-center space-x-2">
              <RadioGroupItem value={String(s)} id={`moto-strokes-${s}`} />
              <Label htmlFor={`moto-strokes-${s}`} className="text-sm cursor-pointer">
                {t(`moto.strokes.${s}` as TranslationKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Transmission */}
      <div>
        <Label className="text-sm font-medium mb-2 block">{t('transmission' as TranslationKey)}</Label>
        <Select value={data.transmission} onValueChange={(v) => updateField('transmission', v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder={t('select' as TranslationKey)} />
          </SelectTrigger>
          <SelectContent>
            {motoTransmissions.map(trans => (
              <SelectItem key={trans} value={trans}>
                {t(`transmission.${trans}` as TranslationKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};

export default MotoFieldsForm;
