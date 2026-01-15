import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { carBrands, bodyTypes, getYearOptions } from '@/data/carData';
import { TranslationKey } from '@/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface CarFieldsData {
  condition: 'new' | 'used' | '';
  brand: string;
  model: string;
  year: string;
  mileage: string;
  transmission: string;
  driveType: string;
  engineType: string;
  engineVolume: string;
  fuelConsumption: string;
  power: string;
  bodyCondition: string;
  bodyType: string;
  seats: string;
  trunkVolume: string;
  steeringPosition: string;
}

export const defaultCarFields: CarFieldsData = {
  condition: '',
  brand: '',
  model: '',
  year: '',
  mileage: '',
  transmission: '',
  driveType: '',
  engineType: '',
  engineVolume: '',
  fuelConsumption: '',
  power: '',
  bodyCondition: '',
  bodyType: '',
  seats: '',
  trunkVolume: '',
  steeringPosition: '',
};

interface CarFieldsFormProps {
  data: CarFieldsData;
  onChange: (data: CarFieldsData) => void;
}

const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function CarFieldsForm({ data, onChange }: CarFieldsFormProps) {
  const { t } = useLanguage();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const selectedBrand = useMemo(() => {
    return carBrands.find(b => b.id === data.brand);
  }, [data.brand]);

  const handleChange = <K extends keyof CarFieldsData>(key: K, value: CarFieldsData[K]) => {
    const newData = { ...data, [key]: value };
    // Reset model when brand changes
    if (key === 'brand' && value !== data.brand) {
      newData.model = '';
    }
    onChange(newData);
  };

  return (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h3 className="font-semibold text-foreground">{safeT(t, 'carFilters.title') || 'Car Details'}</h3>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.condition')}</Label>
        <RadioGroup
          value={data.condition}
          onValueChange={(value) => handleChange('condition', value as 'new' | 'used')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="car-condition-new" />
            <Label htmlFor="car-condition-new" className="font-normal cursor-pointer">{safeT(t, 'carFilters.conditionNew')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="car-condition-used" />
            <Label htmlFor="car-condition-used" className="font-normal cursor-pointer">{safeT(t, 'carFilters.conditionUsed')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Brand & Model */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.brand')}</Label>
          <Select value={data.brand} onValueChange={(v) => handleChange('brand', v)}>
            <SelectTrigger>
              <SelectValue placeholder={safeT(t, 'carFilters.selectBrand') || 'Select brand'} />
            </SelectTrigger>
            <SelectContent>
              {carBrands.map(brand => (
                <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.model')}</Label>
          <Select 
            value={data.model} 
            onValueChange={(v) => handleChange('model', v)}
            disabled={!selectedBrand}
          >
            <SelectTrigger>
              <SelectValue placeholder={safeT(t, 'carFilters.selectModel') || 'Select model'} />
            </SelectTrigger>
            <SelectContent>
              {selectedBrand?.models.map(model => (
                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Year & Mileage */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.year')}</Label>
          <Select value={data.year} onValueChange={(v) => handleChange('year', v)}>
            <SelectTrigger>
              <SelectValue placeholder={safeT(t, 'filters.select') || 'Select'} />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.mileage')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.mileage}
            onChange={(e) => handleChange('mileage', e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.transmission')}</Label>
        <Select value={data.transmission} onValueChange={(v) => handleChange('transmission', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select') || 'Select'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">{safeT(t, 'carFilters.transmissionManual')}</SelectItem>
            <SelectItem value="robot">{safeT(t, 'carFilters.transmissionRobot')}</SelectItem>
            <SelectItem value="variator">{safeT(t, 'carFilters.transmissionVariator')}</SelectItem>
            <SelectItem value="classic-automatic">{safeT(t, 'carFilters.transmissionClassicAuto')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drive Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.driveType')}</Label>
        <Select value={data.driveType} onValueChange={(v) => handleChange('driveType', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select') || 'Select'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="front">{safeT(t, 'carFilters.driveFront')}</SelectItem>
            <SelectItem value="rear">{safeT(t, 'carFilters.driveRear')}</SelectItem>
            <SelectItem value="all">{safeT(t, 'carFilters.driveAll')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Engine Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.engineType')}</Label>
        <Select value={data.engineType} onValueChange={(v) => handleChange('engineType', v)}>
          <SelectTrigger>
            <SelectValue placeholder={safeT(t, 'filters.select') || 'Select'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="petrol">{safeT(t, 'carFilters.enginePetrol')}</SelectItem>
            <SelectItem value="gas">{safeT(t, 'carFilters.engineGas')}</SelectItem>
            <SelectItem value="diesel">{safeT(t, 'carFilters.engineDiesel')}</SelectItem>
            <SelectItem value="electric">{safeT(t, 'carFilters.engineElectric')}</SelectItem>
            <SelectItem value="hybrid">{safeT(t, 'carFilters.engineHybrid')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Engine Volume, Power, Fuel Consumption */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.engineVolume')}</Label>
          <Input
            type="number"
            placeholder="0.0"
            value={data.engineVolume}
            onChange={(e) => handleChange('engineVolume', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.power')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.power}
            onChange={(e) => handleChange('power', e.target.value)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.fuelConsumption')}</Label>
          <Input
            type="number"
            placeholder="0.0"
            value={data.fuelConsumption}
            onChange={(e) => handleChange('fuelConsumption', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      {/* Body Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.bodyCondition')}</Label>
        <RadioGroup
          value={data.bodyCondition}
          onValueChange={(value) => handleChange('bodyCondition', value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-damaged" id="car-body-not-damaged" />
            <Label htmlFor="car-body-not-damaged" className="font-normal cursor-pointer">{safeT(t, 'carFilters.bodyConditionNotDamaged')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="damaged" id="car-body-damaged" />
            <Label htmlFor="car-body-damaged" className="font-normal cursor-pointer">{safeT(t, 'carFilters.bodyConditionDamaged')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Body Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.bodyType')}</Label>
        <div className="grid grid-cols-4 gap-2">
          {bodyTypes.map(bodyType => (
            <button
              key={bodyType.id}
              type="button"
              onClick={() => handleChange('bodyType', data.bodyType === bodyType.id ? '' : bodyType.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors",
                data.bodyType === bodyType.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="text-xs text-center">{safeT(t, bodyType.translationKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Seats & Trunk Volume */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.seats')}</Label>
          <Input
            type="number"
            placeholder="5"
            value={data.seats}
            onChange={(e) => handleChange('seats', e.target.value)}
            min="1"
            max="50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.trunkVolume')}</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.trunkVolume}
            onChange={(e) => handleChange('trunkVolume', e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Steering Position */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.steeringPosition')}</Label>
        <RadioGroup
          value={data.steeringPosition}
          onValueChange={(value) => handleChange('steeringPosition', value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="car-steering-left" />
            <Label htmlFor="car-steering-left" className="font-normal cursor-pointer">{safeT(t, 'carFilters.steeringLeft')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="car-steering-right" />
            <Label htmlFor="car-steering-right" className="font-normal cursor-pointer">{safeT(t, 'carFilters.steeringRight')}</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
