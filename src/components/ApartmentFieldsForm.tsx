import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TranslationKey } from '@/i18n/translations';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  apartmentRooms, apartmentHousingTypes, apartmentSellerTypes,
  apartmentBathrooms, apartmentWindows, apartmentBuildingTypes,
  apartmentElevators, apartmentParkings, apartmentRenovations,
  apartmentRoomTypes, apartmentBalconies,
} from '@/data/apartmentData';

export interface ApartmentFieldsData {
  rooms: string;
  mortgage: boolean;
  pricePerSqm: string;
  area: string;
  floor: string;
  housingType: string;
  sellerType: string;
  bathroom: string;
  windows: string[];
  buildYear: string;
  totalFloors: string;
  buildingType: string;
  elevators: string[];
  parkings: string[];
  renovation: string;
  kitchenArea: string;
  roomType: string;
  balconies: string[];
  ceilingHeight: string;
}

export const defaultApartmentFields: ApartmentFieldsData = {
  rooms: '',
  mortgage: false,
  pricePerSqm: '',
  area: '',
  floor: '',
  housingType: '',
  sellerType: '',
  bathroom: '',
  windows: [],
  buildYear: '',
  totalFloors: '',
  buildingType: '',
  elevators: [],
  parkings: [],
  renovation: '',
  kitchenArea: '',
  roomType: '',
  balconies: [],
  ceilingHeight: '',
};

interface ApartmentFieldsFormProps {
  data: ApartmentFieldsData;
  onChange: (data: ApartmentFieldsData) => void;
  fieldErrors?: Record<string, boolean>;
  onClearError?: (field: string) => void;
}

const safeT = (t: (key: TranslationKey) => string, key: string): string => {
  return t(key as TranslationKey);
};

export function ApartmentFieldsForm({ data, onChange, fieldErrors = {}, onClearError }: ApartmentFieldsFormProps) {
  const { t } = useLanguage();

  const handleChange = <K extends keyof ApartmentFieldsData>(key: K, value: ApartmentFieldsData[K]) => {
    onChange({ ...data, [key]: value });
    onClearError?.(key);
  };

  const toggleArrayItem = (key: 'windows' | 'elevators' | 'parkings' | 'balconies', item: string) => {
    const arr = data[key];
    handleChange(key, arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  return (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h3 className="font-semibold text-foreground">{safeT(t, 'aptFilters.title')}</h3>

      {/* Rooms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.rooms')}</Label>
        <Select value={data.rooms} onValueChange={v => handleChange('rooms', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentRooms.map(r => (
              <SelectItem key={r.id} value={r.id}>{safeT(t, r.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mortgage */}
      <div className="flex items-center space-x-2">
        <Checkbox id="apt-form-mortgage" checked={data.mortgage}
          onCheckedChange={c => handleChange('mortgage', !!c)} />
        <Label htmlFor="apt-form-mortgage" className="font-normal cursor-pointer">{safeT(t, 'aptFilters.mortgage')}</Label>
      </div>

      {/* Area & Price per sqm */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'aptFilters.area')} <span className="text-muted-foreground">(м²)</span></Label>
          <Input type="number" placeholder="0" value={data.area} onChange={e => handleChange('area', e.target.value)} min="0" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'aptFilters.pricePerSqm')} <span className="text-muted-foreground">(€/м²)</span></Label>
          <Input type="number" placeholder="0" value={data.pricePerSqm} onChange={e => handleChange('pricePerSqm', e.target.value)} min="0" />
        </div>
      </div>

      {/* Floor & Total Floors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'aptFilters.floor')}</Label>
          <Input type="number" placeholder="0" value={data.floor} onChange={e => handleChange('floor', e.target.value)} min="0" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{safeT(t, 'aptFilters.totalFloors')}</Label>
          <Input type="number" placeholder="0" value={data.totalFloors} onChange={e => handleChange('totalFloors', e.target.value)} min="0" />
        </div>
      </div>

      {/* Housing type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.housingType')}</Label>
        <Select value={data.housingType} onValueChange={v => handleChange('housingType', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentHousingTypes.filter(h => h.id !== 'all').map(h => (
              <SelectItem key={h.id} value={h.id}>{safeT(t, h.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seller type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.sellerType')}</Label>
        <Select value={data.sellerType} onValueChange={v => handleChange('sellerType', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentSellerTypes.filter(s => s.id !== 'all').map(s => (
              <SelectItem key={s.id} value={s.id}>{safeT(t, s.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bathroom */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.bathroom')}</Label>
        <Select value={data.bathroom} onValueChange={v => handleChange('bathroom', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentBathrooms.map(b => (
              <SelectItem key={b.id} value={b.id}>{safeT(t, b.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Windows */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.windows')}</Label>
        <div className="space-y-2">
          {apartmentWindows.map(w => (
            <div key={w.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-form-win-${w.id}`} checked={data.windows.includes(w.id)}
                onCheckedChange={() => toggleArrayItem('windows', w.id)} />
              <Label htmlFor={`apt-form-win-${w.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, w.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Build year */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.buildYear')}</Label>
        <Input type="number" placeholder="0" value={data.buildYear} onChange={e => handleChange('buildYear', e.target.value)} min="1800" />
      </div>

      {/* Building type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.buildingType')}</Label>
        <Select value={data.buildingType} onValueChange={v => handleChange('buildingType', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentBuildingTypes.filter(b => b.id !== 'any').map(b => (
              <SelectItem key={b.id} value={b.id}>{safeT(t, b.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Elevator */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.elevator')}</Label>
        <div className="space-y-2">
          {apartmentElevators.map(e => (
            <div key={e.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-form-elev-${e.id}`} checked={data.elevators.includes(e.id)}
                onCheckedChange={() => toggleArrayItem('elevators', e.id)} />
              <Label htmlFor={`apt-form-elev-${e.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, e.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Parking */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.parking')}</Label>
        <div className="space-y-2">
          {apartmentParkings.map(p => (
            <div key={p.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-form-park-${p.id}`} checked={data.parkings.includes(p.id)}
                onCheckedChange={() => toggleArrayItem('parkings', p.id)} />
              <Label htmlFor={`apt-form-park-${p.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, p.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Renovation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.renovation')}</Label>
        <Select value={data.renovation} onValueChange={v => handleChange('renovation', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentRenovations.map(r => (
              <SelectItem key={r.id} value={r.id}>{safeT(t, r.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kitchen area */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.kitchenArea')} <span className="text-muted-foreground">(м²)</span></Label>
        <Input type="number" placeholder="0" value={data.kitchenArea} onChange={e => handleChange('kitchenArea', e.target.value)} min="0" />
      </div>

      {/* Room type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.roomType')}</Label>
        <Select value={data.roomType} onValueChange={v => handleChange('roomType', v)}>
          <SelectTrigger><SelectValue placeholder={safeT(t, 'filters.select')} /></SelectTrigger>
          <SelectContent>
            {apartmentRoomTypes.map(r => (
              <SelectItem key={r.id} value={r.id}>{safeT(t, r.translationKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Balcony */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.balcony')}</Label>
        <div className="space-y-2">
          {apartmentBalconies.map(b => (
            <div key={b.id} className="flex items-center space-x-2">
              <Checkbox id={`apt-form-balc-${b.id}`} checked={data.balconies.includes(b.id)}
                onCheckedChange={() => toggleArrayItem('balconies', b.id)} />
              <Label htmlFor={`apt-form-balc-${b.id}`} className="font-normal cursor-pointer text-sm">{safeT(t, b.translationKey)}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Ceiling height */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{safeT(t, 'aptFilters.ceilingHeight')} <span className="text-muted-foreground">(м)</span></Label>
        <Input type="number" step="0.1" placeholder="0" value={data.ceilingHeight} onChange={e => handleChange('ceilingHeight', e.target.value)} min="0" />
      </div>
    </div>
  );
}
