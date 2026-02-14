import { useLanguage } from '@/contexts/LanguageContext';
import { ListingWithOwner } from '@/hooks/useListings';
import { carBrands, bodyTypes } from '@/data/carData';
import {
  Car,
  Calendar,
  Gauge,
  Settings,
  Fuel,
  Zap,
  Users,
  Package,
  Compass,
  CircleDot,
  Wrench,
  Bike,
  Globe,
  Cog,
} from 'lucide-react';

interface TransportSpecificationsProps {
  listing: ListingWithOwner;
}

type SpecItem = { icon: React.ReactNode; label: string; value: string | number };

export const TransportSpecifications = ({ listing }: TransportSpecificationsProps) => {
  const { t } = useLanguage();

  const sub = listing.subcategory;
  if (!sub || listing.category !== 'transport') return null;

  const tAny = (key: string) => t(key as any);

  // Helper maps
  const conditionMap = (condition: string) => {
    const map: Record<string, string> = {
      new: tAny('condition.new'),
      used: tAny('condition.used'),
      for_parts: tAny('condition.forParts'),
    };
    return map[condition] || condition;
  };

  const engineTypeMap = (et: string) => {
    const map: Record<string, string> = {
      petrol: tAny('engine.petrol'),
      diesel: tAny('engine.diesel'),
      electric: tAny('engine.electric'),
      hybrid: tAny('engine.hybrid'),
      gas: tAny('engine.gas'),
    };
    return map[et] || et;
  };

  const countryMap = (c: string) => {
    const key = `countries.${c}`;
    const val = tAny(key);
    return val !== key ? val : c;
  };

  const specs: SpecItem[] = [];
  let title = '';

  if (sub === 'cars') {
    title = tAny('carFilters.title');
    buildCarSpecs(specs);
  } else if (sub === 'motorbikes') {
    title = tAny('moto.specifications');
    buildMotoSpecs(specs);
  } else if (sub === 'mopeds_scooters') {
    title = tAny('mopedFilters.title');
    buildMopedSpecs(specs);
  } else if (sub === 'atvs') {
    title = tAny('atvFilters.title');
    buildAtvSpecs(specs);
  } else if (sub === 'quads_buggies') {
    title = tAny('quadFilters.title');
    buildQuadSpecs(specs);
  } else if (sub === 'karting') {
    title = tAny('kartingFilters.title');
    buildKartingSpecs(specs);
  }

  if (specs.length === 0) return null;

  function addSpec(icon: React.ReactNode, label: string, value: string | number | null | undefined) {
    if (value !== null && value !== undefined && value !== '') {
      specs.push({ icon, label, value });
    }
  }

  function buildCarSpecs(s: SpecItem[]) {
    const l = listing;
    if (l.car_condition) addSpec(<CircleDot className="w-5 h-5" />, tAny('carFilters.condition'), getCarCondition(l.car_condition));
    if (l.car_brand) {
      const brand = carBrands.find(b => b.id === l.car_brand);
      const brandName = brand?.name || l.car_brand;
      const model = l.car_model && brand ? brand.models.find(m => m.id === l.car_model)?.name || l.car_model : '';
      addSpec(<Car className="w-5 h-5" />, tAny('brand'), model ? `${brandName} ${model}` : brandName);
    }
    if (l.car_year) addSpec(<Calendar className="w-5 h-5" />, tAny('carFilters.year'), l.car_year);
    if (l.car_mileage != null) addSpec(<Gauge className="w-5 h-5" />, tAny('carFilters.mileage'), l.car_mileage.toLocaleString());
    if (l.car_body_type) {
      const bt = bodyTypes.find(b => b.id === l.car_body_type);
      addSpec(<Car className="w-5 h-5" />, tAny('carFilters.bodyType'), bt ? tAny(bt.translationKey) : l.car_body_type);
    }
    if (l.car_transmission) addSpec(<Settings className="w-5 h-5" />, tAny('carFilters.transmission'), getCarTransmission(l.car_transmission));
    if (l.car_drive_type) addSpec(<Compass className="w-5 h-5" />, tAny('carFilters.driveType'), getCarDrive(l.car_drive_type));
    if (l.car_engine_type) addSpec(<Fuel className="w-5 h-5" />, tAny('carFilters.engineType'), engineTypeMap(l.car_engine_type));
    if (l.car_engine_volume) addSpec(<Wrench className="w-5 h-5" />, tAny('carFilters.engineVolume'), l.car_engine_volume);
    if (l.car_power) addSpec(<Zap className="w-5 h-5" />, tAny('carFilters.power'), l.car_power);
    if (l.car_fuel_consumption) addSpec(<Fuel className="w-5 h-5" />, tAny('carFilters.fuelConsumption'), `${l.car_fuel_consumption} L/100km`);
    if (l.car_body_condition) {
      const m: Record<string, string> = { 'not-damaged': tAny('carFilters.bodyConditionNotDamaged'), damaged: tAny('carFilters.bodyConditionDamaged') };
      addSpec(<Car className="w-5 h-5" />, tAny('carFilters.bodyCondition'), m[l.car_body_condition] || l.car_body_condition);
    }
    if (l.car_seats) addSpec(<Users className="w-5 h-5" />, tAny('carFilters.seats'), l.car_seats);
    if (l.car_trunk_volume) addSpec(<Package className="w-5 h-5" />, tAny('carFilters.trunkVolume'), `${l.car_trunk_volume} L`);
    if (l.car_steering_position) {
      const m: Record<string, string> = { left: tAny('carFilters.steeringLeft'), right: tAny('carFilters.steeringRight') };
      addSpec(<Compass className="w-5 h-5" />, tAny('carFilters.steeringPosition'), m[l.car_steering_position] || l.car_steering_position);
    }
  }

  function getCarCondition(c: string) {
    const m: Record<string, string> = { new: tAny('carFilters.conditionNew'), used: tAny('carFilters.conditionUsed') };
    return m[c] || c;
  }
  function getCarTransmission(t: string) {
    const m: Record<string, string> = {
      manual: tAny('carFilters.transmissionManual'), automatic: tAny('carFilters.transmissionAutomatic'),
      robot: tAny('carFilters.transmissionRobot'), variator: tAny('carFilters.transmissionVariator'),
      'classic-automatic': tAny('carFilters.transmissionClassicAuto'),
    };
    return m[t] || t;
  }
  function getCarDrive(d: string) {
    const m: Record<string, string> = { rear: tAny('carFilters.driveRear'), front: tAny('carFilters.driveFront'), all: tAny('carFilters.driveAll') };
    return m[d] || d;
  }

  function buildMotoSpecs(s: SpecItem[]) {
    const l = listing;
    if (l.moto_condition) addSpec(<CircleDot className="w-5 h-5" />, tAny('condition'), conditionMap(l.moto_condition));
    if (l.moto_type) addSpec(<Bike className="w-5 h-5" />, tAny('moto.type'), tAny(`moto.type.${l.moto_type}`));
    if (l.moto_brand) addSpec(<Car className="w-5 h-5" />, tAny('brand'), l.moto_brand);
    if (l.moto_model) addSpec(<Car className="w-5 h-5" />, tAny('model'), l.moto_model);
    if (l.moto_year) addSpec(<Calendar className="w-5 h-5" />, tAny('carFilters.year'), l.moto_year);
    if (l.moto_mileage != null) addSpec(<Gauge className="w-5 h-5" />, tAny('carFilters.mileage'), l.moto_mileage.toLocaleString());
    if (l.moto_engine_type) addSpec(<Fuel className="w-5 h-5" />, tAny('engineType'), engineTypeMap(l.moto_engine_type));
    if (l.moto_engine_volume) addSpec(<Wrench className="w-5 h-5" />, tAny('carFilters.engineVolume'), l.moto_engine_volume);
    if (l.moto_power_hp) addSpec(<Zap className="w-5 h-5" />, tAny('powerHp'), l.moto_power_hp);
    if (l.moto_transmission) {
      const m: Record<string, string> = {
        manual: tAny('transmission.manual'), automatic: tAny('transmission.automatic'),
        robot: tAny('transmission.robot'), variator: tAny('transmission.variator'),
      };
      addSpec(<Settings className="w-5 h-5" />, tAny('carFilters.transmission'), m[l.moto_transmission] || l.moto_transmission);
    }
    if (l.moto_fuel_delivery) addSpec(<Cog className="w-5 h-5" />, tAny('moto.fuelDelivery'), tAny(`moto.fuelDelivery.${l.moto_fuel_delivery}`));
    if (l.moto_strokes) addSpec(<Cog className="w-5 h-5" />, tAny('moto.strokes'), `${l.moto_strokes}`);
    if (l.moto_origin_country) addSpec(<Globe className="w-5 h-5" />, tAny('mopedFilters.originCountry'), countryMap(l.moto_origin_country));
  }

  function buildMopedSpecs(s: SpecItem[]) {
    const l = listing;
    if (l.moped_condition) addSpec(<CircleDot className="w-5 h-5" />, tAny('condition'), conditionMap(l.moped_condition));
    if (l.moped_type) addSpec(<Bike className="w-5 h-5" />, tAny('mopedFilters.type'), tAny(`mopedFilters.type${capitalize(l.moped_type)}`));
    if (l.moped_brand) addSpec(<Car className="w-5 h-5" />, tAny('brand'), l.moped_brand);
    if (l.moped_model) addSpec(<Car className="w-5 h-5" />, tAny('model'), l.moped_model);
    if (l.moped_year) addSpec(<Calendar className="w-5 h-5" />, tAny('carFilters.year'), l.moped_year);
    if (l.moped_mileage != null) addSpec(<Gauge className="w-5 h-5" />, tAny('carFilters.mileage'), l.moped_mileage.toLocaleString());
    if (l.moped_engine_type) addSpec(<Fuel className="w-5 h-5" />, tAny('engineType'), engineTypeMap(l.moped_engine_type));
    if (l.moped_engine_volume) addSpec(<Wrench className="w-5 h-5" />, tAny('carFilters.engineVolume'), l.moped_engine_volume);
    if (l.moped_power) addSpec(<Zap className="w-5 h-5" />, tAny('powerHp'), l.moped_power);
    if (l.moped_origin_country) addSpec(<Globe className="w-5 h-5" />, tAny('mopedFilters.originCountry'), countryMap(l.moped_origin_country));
  }

  function buildAtvSpecs(s: SpecItem[]) {
    const l = listing;
    if (l.atv_condition) addSpec(<CircleDot className="w-5 h-5" />, tAny('condition'), conditionMap(l.atv_condition));
    if (l.atv_type) addSpec(<Car className="w-5 h-5" />, tAny('atvFilters.type'), tAny(`atvFilters.type${capitalize(l.atv_type)}`));
    if (l.atv_brand) addSpec(<Car className="w-5 h-5" />, tAny('brand'), l.atv_brand);
    if (l.atv_model) addSpec(<Car className="w-5 h-5" />, tAny('model'), l.atv_model);
    if (l.atv_year) addSpec(<Calendar className="w-5 h-5" />, tAny('carFilters.year'), l.atv_year);
    if (l.atv_mileage != null) addSpec(<Gauge className="w-5 h-5" />, tAny('carFilters.mileage'), l.atv_mileage.toLocaleString());
    if (l.atv_engine_type) addSpec(<Fuel className="w-5 h-5" />, tAny('engineType'), engineTypeMap(l.atv_engine_type));
    if (l.atv_engine_volume) addSpec(<Wrench className="w-5 h-5" />, tAny('carFilters.engineVolume'), l.atv_engine_volume);
    if (l.atv_power) addSpec(<Zap className="w-5 h-5" />, tAny('powerHp'), l.atv_power);
    if (l.atv_max_passengers) addSpec(<Users className="w-5 h-5" />, tAny('carFilters.seats'), l.atv_max_passengers);
    if (l.atv_origin_country) addSpec(<Globe className="w-5 h-5" />, tAny('mopedFilters.originCountry'), countryMap(l.atv_origin_country));
  }

  function buildQuadSpecs(s: SpecItem[]) {
    const l = listing;
    if (l.quad_condition) addSpec(<CircleDot className="w-5 h-5" />, tAny('condition'), conditionMap(l.quad_condition));
    if (l.quad_type) addSpec(<Car className="w-5 h-5" />, tAny('quadFilters.type'), tAny(`quadFilters.type${capitalize(l.quad_type)}`));
    if (l.quad_brand) addSpec(<Car className="w-5 h-5" />, tAny('brand'), l.quad_brand);
    if (l.quad_model) addSpec(<Car className="w-5 h-5" />, tAny('model'), l.quad_model);
    if (l.quad_year) addSpec(<Calendar className="w-5 h-5" />, tAny('carFilters.year'), l.quad_year);
    if (l.quad_mileage != null) addSpec(<Gauge className="w-5 h-5" />, tAny('carFilters.mileage'), l.quad_mileage.toLocaleString());
    if (l.quad_engine_type) addSpec(<Fuel className="w-5 h-5" />, tAny('engineType'), engineTypeMap(l.quad_engine_type));
    if (l.quad_engine_volume) addSpec(<Wrench className="w-5 h-5" />, tAny('carFilters.engineVolume'), l.quad_engine_volume);
    if (l.quad_power) addSpec(<Zap className="w-5 h-5" />, tAny('powerHp'), l.quad_power);
    if (l.quad_max_passengers) addSpec(<Users className="w-5 h-5" />, tAny('carFilters.seats'), l.quad_max_passengers);
    if (l.quad_origin_country) addSpec(<Globe className="w-5 h-5" />, tAny('mopedFilters.originCountry'), countryMap(l.quad_origin_country));
  }

  function buildKartingSpecs(s: SpecItem[]) {
    const l = listing;
    if (l.kart_condition) addSpec(<CircleDot className="w-5 h-5" />, tAny('condition'), conditionMap(l.kart_condition));
    if ((l as any).kart_brand) addSpec(<Car className="w-5 h-5" />, tAny('brand'), (l as any).kart_brand);
    if ((l as any).kart_model) addSpec(<Car className="w-5 h-5" />, tAny('model'), (l as any).kart_model);
  }

  function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="text-primary">{spec.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{spec.label}</p>
                <p className="font-medium text-foreground truncate">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
