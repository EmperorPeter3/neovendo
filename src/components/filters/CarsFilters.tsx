import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { carBrands, bodyTypes, getYearOptions } from '@/data/carData';
import { TranslationKey } from '@/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface CarsFiltersState {
  condition: 'all' | 'new' | 'used';
  brands: string[];
  models: string[];
  yearFrom: string;
  yearTo: string;
  mileageFrom: string;
  mileageTo: string;
  transmissionManual: boolean;
  transmissionAutomatic: 'unchecked' | 'checked' | 'indeterminate';
  transmissionRobot: boolean;
  transmissionVariator: boolean;
  transmissionClassic: boolean;
  driveRear: boolean;
  driveFront: boolean;
  driveAll: boolean;
  enginePetrol: boolean;
  engineGas: boolean;
  engineDiesel: boolean;
  engineElectric: boolean;
  engineHybrid: boolean;
  engineVolumeFrom: string;
  engineVolumeTo: string;
  fuelConsumptionFrom: string;
  fuelConsumptionTo: string;
  powerFrom: string;
  powerTo: string;
  bodyCondition: 'all' | 'not-damaged' | 'damaged';
  bodyTypes: string[];
  seatsFrom: string;
  seatsTo: string;
  trunkVolumeFrom: string;
  trunkVolumeTo: string;
  steeringPosition: 'any' | 'left' | 'right';
}

const defaultFilters: CarsFiltersState = {
  condition: 'all',
  brands: [],
  models: [],
  yearFrom: '',
  yearTo: '',
  mileageFrom: '',
  mileageTo: '',
  transmissionManual: false,
  transmissionAutomatic: 'unchecked',
  transmissionRobot: false,
  transmissionVariator: false,
  transmissionClassic: false,
  driveRear: false,
  driveFront: false,
  driveAll: false,
  enginePetrol: false,
  engineGas: false,
  engineDiesel: false,
  engineElectric: false,
  engineHybrid: false,
  engineVolumeFrom: '',
  engineVolumeTo: '',
  fuelConsumptionFrom: '',
  fuelConsumptionTo: '',
  powerFrom: '',
  powerTo: '',
  bodyCondition: 'all',
  bodyTypes: [],
  seatsFrom: '',
  seatsTo: '',
  trunkVolumeFrom: '',
  trunkVolumeTo: '',
  steeringPosition: 'any',
};

interface CarsFiltersProps {
  filters: CarsFiltersState;
  onChange: (filters: CarsFiltersState) => void;
}

// Helper to safely translate
const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function CarsFilters({ filters, onChange }: CarsFiltersProps) {
  const { t } = useLanguage();
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const yearOptions = useMemo(() => getYearOptions(), []);

  const selectedBrandsData = useMemo(() => {
    return carBrands.filter(brand => filters.brands.includes(brand.id));
  }, [filters.brands]);

  useEffect(() => {
    const { transmissionRobot, transmissionVariator, transmissionClassic } = filters;
    const anyAutoChecked = transmissionRobot || transmissionVariator || transmissionClassic;
    const allAutoChecked = transmissionRobot && transmissionVariator && transmissionClassic;

    if (allAutoChecked) {
      if (filters.transmissionAutomatic !== 'checked') {
        onChange({ ...filters, transmissionAutomatic: 'checked' });
      }
    } else if (anyAutoChecked) {
      if (filters.transmissionAutomatic !== 'indeterminate') {
        onChange({ ...filters, transmissionAutomatic: 'indeterminate' });
      }
    } else {
      if (filters.transmissionAutomatic !== 'unchecked') {
        onChange({ ...filters, transmissionAutomatic: 'unchecked' });
      }
    }
  }, [filters.transmissionRobot, filters.transmissionVariator, filters.transmissionClassic]);

  const handleAutomaticToggle = () => {
    const newState = filters.transmissionAutomatic === 'checked' ? 'unchecked' : 'checked';
    const allChecked = newState === 'checked';
    onChange({
      ...filters,
      transmissionAutomatic: newState,
      transmissionRobot: allChecked,
      transmissionVariator: allChecked,
      transmissionClassic: allChecked,
    });
  };

  const toggleBrand = (brandId: string) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(b => b !== brandId)
      : [...filters.brands, brandId];
    
    const removedBrand = !newBrands.includes(brandId);
    let newModels = filters.models;
    if (removedBrand) {
      const brand = carBrands.find(b => b.id === brandId);
      if (brand) {
        const brandModelIds = brand.models.map(m => `${brandId}:${m.id}`);
        newModels = filters.models.filter(m => !brandModelIds.includes(m));
      }
    }

    onChange({ ...filters, brands: newBrands, models: newModels });
  };

  const toggleModel = (modelKey: string) => {
    const newModels = filters.models.includes(modelKey)
      ? filters.models.filter(m => m !== modelKey)
      : [...filters.models, modelKey];
    onChange({ ...filters, models: newModels });
  };

  const toggleBodyType = (bodyTypeId: string) => {
    const newBodyTypes = filters.bodyTypes.includes(bodyTypeId)
      ? filters.bodyTypes.filter(b => b !== bodyTypeId)
      : [...filters.bodyTypes, bodyTypeId];
    onChange({ ...filters, bodyTypes: newBodyTypes });
  };

  const renderRangeInputs = (
    labelKey: string,
    fromValue: string,
    toValue: string,
    fromKey: keyof CarsFiltersState,
    toKey: keyof CarsFiltersState
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{safeT(t, labelKey)}</Label>
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
      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.condition')}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={(value) => onChange({ ...filters, condition: value as CarsFiltersState['condition'] })}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="condition-all" />
            <Label htmlFor="condition-all" className="font-normal cursor-pointer">{safeT(t, 'carFilters.conditionAll')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="condition-new" />
            <Label htmlFor="condition-new" className="font-normal cursor-pointer">{safeT(t, 'carFilters.conditionNew')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="used" id="condition-used" />
            <Label htmlFor="condition-used" className="font-normal cursor-pointer">{safeT(t, 'carFilters.conditionUsed')}</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.brand')}</Label>
        <Popover open={brandsOpen} onOpenChange={setBrandsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between h-auto min-h-9 py-2">
              <div className="flex flex-wrap gap-1 flex-1">
                {filters.brands.length > 0 ? (
                  filters.brands.map(brandId => {
                    const brand = carBrands.find(b => b.id === brandId);
                    return brand ? (
                      <Badge key={brandId} variant="secondary" className="mr-1">
                        {brand.name}
                        <button className="ml-1 hover:text-destructive" onClick={(e) => { e.stopPropagation(); toggleBrand(brandId); }}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <span className="text-muted-foreground">{safeT(t, 'carFilters.selectBrands')}</span>
                )}
              </div>
              {brandsOpen ? <ChevronUp className="h-4 w-4 ml-2 shrink-0" /> : <ChevronDown className="h-4 w-4 ml-2 shrink-0" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-64 overflow-y-auto" align="start">
            <div className="p-2 grid grid-cols-2 gap-1">
              {carBrands.map(brand => (
                <div
                  key={brand.id}
                  className={cn("flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-accent", filters.brands.includes(brand.id) && "bg-accent")}
                  onClick={() => toggleBrand(brand.id)}
                >
                  <Checkbox checked={filters.brands.includes(brand.id)} onCheckedChange={() => toggleBrand(brand.id)} />
                  <span className="text-sm">{brand.name}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Model */}
      {filters.brands.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'carFilters.model')}</Label>
          <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between h-auto min-h-9 py-2">
                <div className="flex flex-wrap gap-1 flex-1">
                  {filters.models.length > 0 ? (
                    filters.models.map(modelKey => {
                      const [brandId, modelId] = modelKey.split(':');
                      const brand = carBrands.find(b => b.id === brandId);
                      const model = brand?.models.find(m => m.id === modelId);
                      return model ? (
                        <Badge key={modelKey} variant="secondary" className="mr-1">
                          {brand?.name} {model.name}
                          <button className="ml-1 hover:text-destructive" onClick={(e) => { e.stopPropagation(); toggleModel(modelKey); }}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })
                  ) : (
                    <span className="text-muted-foreground">{safeT(t, 'carFilters.selectModels')}</span>
                  )}
                </div>
                {modelsOpen ? <ChevronUp className="h-4 w-4 ml-2 shrink-0" /> : <ChevronDown className="h-4 w-4 ml-2 shrink-0" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 max-h-64 overflow-y-auto" align="start">
              {selectedBrandsData.map(brand => (
                <div key={brand.id}>
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground bg-muted/50 sticky top-0">{brand.name}</div>
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {brand.models.map(model => {
                      const modelKey = `${brand.id}:${model.id}`;
                      return (
                        <div
                          key={modelKey}
                          className={cn("flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-accent", filters.models.includes(modelKey) && "bg-accent")}
                          onClick={() => toggleModel(modelKey)}
                        >
                          <Checkbox checked={filters.models.includes(modelKey)} onCheckedChange={() => toggleModel(modelKey)} />
                          <span className="text-sm">{model.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Separator />

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.year')}</Label>
        <div className="flex items-center gap-2">
          {renderYearSelect(filters.yearFrom, (v) => onChange({ ...filters, yearFrom: v === 'any' ? '' : v }), safeT(t, 'filters.from'))}
          <span className="text-muted-foreground">—</span>
          {renderYearSelect(filters.yearTo, (v) => onChange({ ...filters, yearTo: v === 'any' ? '' : v }), safeT(t, 'filters.to'))}
        </div>
      </div>

      {renderRangeInputs('carFilters.mileage', filters.mileageFrom, filters.mileageTo, 'mileageFrom', 'mileageTo')}

      <Separator />

      {/* Transmission */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.transmission')}</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="transmission-manual" checked={filters.transmissionManual} onCheckedChange={(checked) => onChange({ ...filters, transmissionManual: !!checked })} />
            <Label htmlFor="transmission-manual" className="font-normal cursor-pointer">{safeT(t, 'carFilters.transmissionManual')}</Label>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="transmission-automatic" 
                checked={filters.transmissionAutomatic === 'checked' ? true : filters.transmissionAutomatic === 'indeterminate' ? 'indeterminate' : false} 
                onCheckedChange={handleAutomaticToggle} 
              />
              <Label htmlFor="transmission-automatic" className="font-normal cursor-pointer">{safeT(t, 'carFilters.transmissionAutomatic')}</Label>
            </div>
            <div className="ml-6 space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="transmission-robot" checked={filters.transmissionRobot} onCheckedChange={(checked) => onChange({ ...filters, transmissionRobot: !!checked })} />
                <Label htmlFor="transmission-robot" className="font-normal cursor-pointer text-sm text-muted-foreground">{safeT(t, 'carFilters.transmissionRobot')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="transmission-variator" checked={filters.transmissionVariator} onCheckedChange={(checked) => onChange({ ...filters, transmissionVariator: !!checked })} />
                <Label htmlFor="transmission-variator" className="font-normal cursor-pointer text-sm text-muted-foreground">{safeT(t, 'carFilters.transmissionVariator')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="transmission-classic" checked={filters.transmissionClassic} onCheckedChange={(checked) => onChange({ ...filters, transmissionClassic: !!checked })} />
                <Label htmlFor="transmission-classic" className="font-normal cursor-pointer text-sm text-muted-foreground">{safeT(t, 'carFilters.transmissionClassicAuto')}</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Drive type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.driveType')}</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="drive-rear" checked={filters.driveRear} onCheckedChange={(checked) => onChange({ ...filters, driveRear: !!checked })} />
            <Label htmlFor="drive-rear" className="font-normal cursor-pointer">{safeT(t, 'carFilters.driveRear')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="drive-front" checked={filters.driveFront} onCheckedChange={(checked) => onChange({ ...filters, driveFront: !!checked })} />
            <Label htmlFor="drive-front" className="font-normal cursor-pointer">{safeT(t, 'carFilters.driveFront')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="drive-all" checked={filters.driveAll} onCheckedChange={(checked) => onChange({ ...filters, driveAll: !!checked })} />
            <Label htmlFor="drive-all" className="font-normal cursor-pointer">{safeT(t, 'carFilters.driveAll')}</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Engine type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.engineType')}</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="engine-petrol" checked={filters.enginePetrol} onCheckedChange={(checked) => onChange({ ...filters, enginePetrol: !!checked })} />
            <Label htmlFor="engine-petrol" className="font-normal cursor-pointer">{safeT(t, 'carFilters.enginePetrol')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="engine-gas" checked={filters.engineGas} onCheckedChange={(checked) => onChange({ ...filters, engineGas: !!checked })} />
            <Label htmlFor="engine-gas" className="font-normal cursor-pointer">{safeT(t, 'carFilters.engineGas')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="engine-diesel" checked={filters.engineDiesel} onCheckedChange={(checked) => onChange({ ...filters, engineDiesel: !!checked })} />
            <Label htmlFor="engine-diesel" className="font-normal cursor-pointer">{safeT(t, 'carFilters.engineDiesel')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="engine-electric" checked={filters.engineElectric} onCheckedChange={(checked) => onChange({ ...filters, engineElectric: !!checked })} />
            <Label htmlFor="engine-electric" className="font-normal cursor-pointer">{safeT(t, 'carFilters.engineElectric')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="engine-hybrid" checked={filters.engineHybrid} onCheckedChange={(checked) => onChange({ ...filters, engineHybrid: !!checked })} />
            <Label htmlFor="engine-hybrid" className="font-normal cursor-pointer">{safeT(t, 'carFilters.engineHybrid')}</Label>
          </div>
        </div>
      </div>

      {renderRangeInputs('carFilters.engineVolume', filters.engineVolumeFrom, filters.engineVolumeTo, 'engineVolumeFrom', 'engineVolumeTo')}
      {renderRangeInputs('carFilters.fuelConsumption', filters.fuelConsumptionFrom, filters.fuelConsumptionTo, 'fuelConsumptionFrom', 'fuelConsumptionTo')}
      {renderRangeInputs('carFilters.power', filters.powerFrom, filters.powerTo, 'powerFrom', 'powerTo')}

      <Separator />

      {/* Body condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.bodyCondition')}</Label>
        <RadioGroup
          value={filters.bodyCondition}
          onValueChange={(value) => onChange({ ...filters, bodyCondition: value as CarsFiltersState['bodyCondition'] })}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="body-all" />
            <Label htmlFor="body-all" className="font-normal cursor-pointer">{safeT(t, 'carFilters.bodyConditionAll')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-damaged" id="body-not-damaged" />
            <Label htmlFor="body-not-damaged" className="font-normal cursor-pointer">{safeT(t, 'carFilters.bodyConditionNotDamaged')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="damaged" id="body-damaged" />
            <Label htmlFor="body-damaged" className="font-normal cursor-pointer">{safeT(t, 'carFilters.bodyConditionDamaged')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Body type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.bodyType')}</Label>
        <div className="grid grid-cols-2 gap-2">
          {bodyTypes.map(bodyType => (
            <button
              key={bodyType.id}
              type="button"
              onClick={() => toggleBodyType(bodyType.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg border transition-colors min-w-0",
                filters.bodyTypes.includes(bodyType.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <BodyTypeIcon type={bodyType.id} />
              <span className="text-xs mt-1 text-center truncate w-full">{safeT(t, bodyType.translationKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {renderRangeInputs('carFilters.seats', filters.seatsFrom, filters.seatsTo, 'seatsFrom', 'seatsTo')}
      {renderRangeInputs('carFilters.trunkVolume', filters.trunkVolumeFrom, filters.trunkVolumeTo, 'trunkVolumeFrom', 'trunkVolumeTo')}

      <Separator />

      {/* Steering position */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'carFilters.steeringPosition')}</Label>
        <RadioGroup
          value={filters.steeringPosition}
          onValueChange={(value) => onChange({ ...filters, steeringPosition: value as CarsFiltersState['steeringPosition'] })}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="steering-any" />
            <Label htmlFor="steering-any" className="font-normal cursor-pointer">{safeT(t, 'carFilters.steeringAny')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="steering-left" />
            <Label htmlFor="steering-left" className="font-normal cursor-pointer">{safeT(t, 'carFilters.steeringLeft')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="steering-right" />
            <Label htmlFor="steering-right" className="font-normal cursor-pointer">{safeT(t, 'carFilters.steeringRight')}</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function BodyTypeIcon({ type }: { type: string }) {
  const iconClasses = "w-10 h-6";
  
  switch (type) {
    case 'sedan':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M6 16V12l6-6h12l4 4h8v6M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    case 'wagon':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M6 16V12l6-6h22v10M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    case 'hatchback':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M6 16V12l6-6h10l8 4h6v6M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    case 'suv':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14h36M6 14V9l6-5h18l4 5v5M10 14v3a2.5 2.5 0 11-5 0v-3M35 14v3a2.5 2.5 0 11-5 0v-3" /></svg>);
    case 'coupe':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M6 16V12l8-6h8l10 4h4v6M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    case 'minivan':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M4 16V8a2 2 0 012-2h24l6 4v6M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    case 'convertible':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M6 16V12l8-2h12l8 2v4M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    case 'liftback':
      return (<svg className={iconClasses} viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16h36M6 16V12l6-6h12l6 3h6v7M10 16v2a2 2 0 11-4 0v-2M34 16v2a2 2 0 11-4 0v-2" /></svg>);
    default:
      return null;
  }
}

export { defaultFilters as defaultCarsFilters };
