import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { TranslationKey } from '@/i18n/translations';
import {
  apartmentRooms, apartmentHousingTypes, apartmentSellerTypes,
  apartmentBathrooms, apartmentWindows, apartmentBuildingTypes,
  apartmentElevators, apartmentParkings, apartmentRenovations,
  apartmentRoomTypes, apartmentBalconies,
} from '@/data/apartmentData';

export interface ApartmentFiltersState {
  rooms: string[];
  mortgage: boolean;
  pricePerSqmFrom: string;
  pricePerSqmTo: string;
  areaFrom: string;
  areaTo: string;
  floorFrom: string;
  floorTo: string;
  notFirstFloor: boolean;
  notLastFloor: boolean;
  onlyLastFloor: boolean;
  housingType: string;
  sellerType: string;
  bathroom: string;
  windows: string[];
  buildYearFrom: string;
  buildYearTo: string;
  totalFloorsFrom: string;
  totalFloorsTo: string;
  buildingType: string;
  elevators: string[];
  parkings: string[];
  renovation: string;
  kitchenAreaFrom: string;
  kitchenAreaTo: string;
  roomType: string;
  balconies: string[];
  ceilingHeightFrom: string;
  ceilingHeightTo: string;
  photosOnly: boolean;
}

export const defaultApartmentFilters: ApartmentFiltersState = {
  rooms: [],
  mortgage: false,
  pricePerSqmFrom: '',
  pricePerSqmTo: '',
  areaFrom: '',
  areaTo: '',
  floorFrom: '',
  floorTo: '',
  notFirstFloor: false,
  notLastFloor: false,
  onlyLastFloor: false,
  housingType: 'all',
  sellerType: 'all',
  bathroom: '',
  windows: [],
  buildYearFrom: '',
  buildYearTo: '',
  totalFloorsFrom: '',
  totalFloorsTo: '',
  buildingType: 'any',
  elevators: [],
  parkings: [],
  renovation: '',
  kitchenAreaFrom: '',
  kitchenAreaTo: '',
  roomType: '',
  balconies: [],
  ceilingHeightFrom: '',
  ceilingHeightTo: '',
  photosOnly: false,
};

interface ApartmentFiltersProps {
  filters: ApartmentFiltersState;
  onChange: (filters: ApartmentFiltersState) => void;
}

const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function ApartmentFilters({ filters, onChange }: ApartmentFiltersProps) {
  const { t } = useLanguage();

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const renderRange = (
    label: string, fromVal: string, toVal: string,
    fromKey: keyof ApartmentFiltersState, toKey: keyof ApartmentFiltersState,
    unit?: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {safeT(t, label)}
        {unit && <span className="text-muted-foreground ml-1">({unit})</span>}
      </Label>
      <div className="flex items-center gap-2">
        <Input type="number" placeholder={safeT(t, 'filters.from')} value={fromVal}
          onChange={e => onChange({ ...filters, [fromKey]: e.target.value })} className="h-9" />
        <span className="text-muted-foreground">—</span>
        <Input type="number" placeholder={safeT(t, 'filters.to')} value={toVal}
          onChange={e => onChange({ ...filters, [toKey]: e.target.value })} className="h-9" />
      </div>
    </div>
  );

  const handleFloorCheckbox = (key: 'notFirstFloor' | 'notLastFloor' | 'onlyLastFloor', checked: boolean) => {
    if (key === 'onlyLastFloor' && checked) {
      onChange({ ...filters, onlyLastFloor: true, notFirstFloor: false, notLastFloor: false });
    } else {
      onChange({ ...filters, [key]: checked, ...(key !== 'onlyLastFloor' ? {} : {}), onlyLastFloor: key === 'onlyLastFloor' ? checked : false });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Rooms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.rooms')}</Label>
        <div className="flex flex-wrap gap-2">
          {apartmentRooms.map(r => (
            <button key={r.id} type="button"
              onClick={() => onChange({ ...filters, rooms: toggleArrayItem(filters.rooms, r.id) })}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                filters.rooms.includes(r.id) ? 'bg-primary/20 text-primary border-primary' : 'border-border hover:bg-secondary'
              }`}
            >
              {safeT(t, r.translationKey)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* 2. Mortgage */}
      <div className="flex items-center space-x-2">
        <Checkbox id="apt-mortgage" checked={filters.mortgage}
          onCheckedChange={c => onChange({ ...filters, mortgage: !!c })} />
        <Label htmlFor="apt-mortgage" className="font-normal cursor-pointer">{safeT(t, 'aptFilters.mortgage')}</Label>
      </div>

      <Separator />

      {/* 3. Price per sqm */}
      {renderRange('aptFilters.pricePerSqm', filters.pricePerSqmFrom, filters.pricePerSqmTo, 'pricePerSqmFrom', 'pricePerSqmTo', '€/м²')}

      {/* 4. Total area */}
      {renderRange('aptFilters.area', filters.areaFrom, filters.areaTo, 'areaFrom', 'areaTo', 'м²')}

      <Separator />

      {/* 5. Floor range */}
      {renderRange('aptFilters.floor', filters.floorFrom, filters.floorTo, 'floorFrom', 'floorTo')}

      {/* 6. Floor checkboxes */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="apt-not-first" checked={filters.notFirstFloor} disabled={filters.onlyLastFloor}
            onCheckedChange={c => handleFloorCheckbox('notFirstFloor', !!c)} />
          <Label htmlFor="apt-not-first" className="font-normal cursor-pointer text-sm">{safeT(t, 'aptFilters.notFirstFloor')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="apt-not-last" checked={filters.notLastFloor} disabled={filters.onlyLastFloor}
            onCheckedChange={c => handleFloorCheckbox('notLastFloor', !!c)} />
          <Label htmlFor="apt-not-last" className="font-normal cursor-pointer text-sm">{safeT(t, 'aptFilters.notLastFloor')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="apt-only-last" checked={filters.onlyLastFloor}
            onCheckedChange={c => handleFloorCheckbox('onlyLastFloor', !!c)} />
          <Label htmlFor="apt-only-last" className="font-normal cursor-pointer text-sm">{safeT(t, 'aptFilters.onlyLastFloor')}</Label>
        </div>
      </div>

      <Separator />

      {/* 7. Housing type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.housingType')}</Label>
        <RadioGroup value={filters.housingType} onValueChange={v => onChange({ ...filters, housingType: v })} className="flex flex-wrap gap-3">
          {apartmentHousingTypes.map(h => (
            <div key={h.id} className="flex items-center space-x-2">
              <RadioGroupItem value={h.id} id={`apt-housing-${h.id}`} />
              <Label htmlFor={`apt-housing-${h.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, h.translationKey)}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* 8. Seller type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.sellerType')}</Label>
        <RadioGroup value={filters.sellerType} onValueChange={v => onChange({ ...filters, sellerType: v })} className="flex flex-wrap gap-3">
          {apartmentSellerTypes.map(s => (
            <div key={s.id} className="flex items-center space-x-2">
              <RadioGroupItem value={s.id} id={`apt-seller-${s.id}`} />
              <Label htmlFor={`apt-seller-${s.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, s.translationKey)}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* 9. Bathroom */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.bathroom')}</Label>
        <div className="flex flex-wrap gap-3">
          {apartmentBathrooms.map(b => (
            <div key={b.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-bath-${b.id}`} checked={filters.bathroom === b.id}
                onCheckedChange={c => onChange({ ...filters, bathroom: c ? b.id : '' })} />
              <Label htmlFor={`apt-bath-${b.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, b.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 10. Windows */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.windows')}</Label>
        <div className="space-y-2">
          {apartmentWindows.map(w => (
            <div key={w.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-win-${w.id}`} checked={filters.windows.includes(w.id)}
                onCheckedChange={() => onChange({ ...filters, windows: toggleArrayItem(filters.windows, w.id) })} />
              <Label htmlFor={`apt-win-${w.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, w.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 11. Build year */}
      {renderRange('aptFilters.buildYear', filters.buildYearFrom, filters.buildYearTo, 'buildYearFrom', 'buildYearTo')}

      {/* 12. Total floors */}
      {renderRange('aptFilters.totalFloors', filters.totalFloorsFrom, filters.totalFloorsTo, 'totalFloorsFrom', 'totalFloorsTo')}

      <Separator />

      {/* 13. Building type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.buildingType')}</Label>
        <RadioGroup value={filters.buildingType} onValueChange={v => onChange({ ...filters, buildingType: v })} className="space-y-1">
          {apartmentBuildingTypes.map(b => (
            <div key={b.id} className="flex items-center space-x-2">
              <RadioGroupItem value={b.id} id={`apt-bldg-${b.id}`} />
              <Label htmlFor={`apt-bldg-${b.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, b.translationKey)}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* 14. Elevator */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.elevator')}</Label>
        <div className="space-y-2">
          {apartmentElevators.map(e => (
            <div key={e.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-elev-${e.id}`} checked={filters.elevators.includes(e.id)}
                onCheckedChange={() => onChange({ ...filters, elevators: toggleArrayItem(filters.elevators, e.id) })} />
              <Label htmlFor={`apt-elev-${e.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, e.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 15. Parking */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.parking')}</Label>
        <div className="space-y-2">
          {apartmentParkings.map(p => (
            <div key={p.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-park-${p.id}`} checked={filters.parkings.includes(p.id)}
                onCheckedChange={() => onChange({ ...filters, parkings: toggleArrayItem(filters.parkings, p.id) })} />
              <Label htmlFor={`apt-park-${p.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, p.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 16. Renovation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.renovation')}</Label>
        <div className="flex flex-wrap gap-3">
          {apartmentRenovations.map(r => (
            <div key={r.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-reno-${r.id}`} checked={filters.renovation === r.id}
                onCheckedChange={c => onChange({ ...filters, renovation: c ? r.id : '' })} />
              <Label htmlFor={`apt-reno-${r.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, r.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 17. Kitchen area */}
      {renderRange('aptFilters.kitchenArea', filters.kitchenAreaFrom, filters.kitchenAreaTo, 'kitchenAreaFrom', 'kitchenAreaTo', 'м²')}

      {/* 18. Room type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.roomType')}</Label>
        <div className="flex flex-wrap gap-3">
          {apartmentRoomTypes.map(r => (
            <div key={r.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-rtype-${r.id}`} checked={filters.roomType === r.id}
                onCheckedChange={c => onChange({ ...filters, roomType: c ? r.id : '' })} />
              <Label htmlFor={`apt-rtype-${r.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, r.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 19. Balcony */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.balcony')}</Label>
        <div className="space-y-2">
          {apartmentBalconies.map(b => (
            <div key={b.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-balc-${b.id}`} checked={filters.balconies.includes(b.id)}
                onCheckedChange={() => onChange({ ...filters, balconies: toggleArrayItem(filters.balconies, b.id) })} />
              <Label htmlFor={`apt-balc-${b.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, b.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 20. Ceiling height */}
      {renderRange('aptFilters.ceilingHeight', filters.ceilingHeightFrom, filters.ceilingHeightTo, 'ceilingHeightFrom', 'ceilingHeightTo', 'м')}

      <Separator />

      {/* 21. Photos only */}
      <div className="flex items-center space-x-2">
        <Checkbox id="apt-photos" checked={filters.photosOnly}
          onCheckedChange={c => onChange({ ...filters, photosOnly: !!c })} />
        <Label htmlFor="apt-photos" className="font-normal cursor-pointer">{safeT(t, 'aptFilters.photosOnly')}</Label>
      </div>
    </div>
  );
}
