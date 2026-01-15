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
  Wrench
} from 'lucide-react';

interface CarSpecificationsProps {
  listing: ListingWithOwner;
}

export const CarSpecifications = ({ listing }: CarSpecificationsProps) => {
  const { t } = useLanguage();

  // Only show for cars subcategory
  if (listing.subcategory !== 'cars') {
    return null;
  }

  // Check if there are any car specs to show
  const hasSpecs = listing.car_brand || listing.car_model || listing.car_year || 
    listing.car_mileage || listing.car_transmission || listing.car_drive_type ||
    listing.car_engine_type || listing.car_engine_volume || listing.car_power ||
    listing.car_fuel_consumption || listing.car_body_type || listing.car_body_condition ||
    listing.car_seats || listing.car_trunk_volume || listing.car_steering_position ||
    listing.car_condition;

  if (!hasSpecs) {
    return null;
  }

  const getBrandName = (brandId: string) => {
    const brand = carBrands.find(b => b.id === brandId);
    return brand?.name || brandId;
  };

  const getModelName = (brandId: string, modelId: string) => {
    const brand = carBrands.find(b => b.id === brandId);
    const model = brand?.models.find(m => m.id === modelId);
    return model?.name || modelId;
  };

  const getBodyTypeName = (bodyTypeId: string) => {
    const bodyType = bodyTypes.find(b => b.id === bodyTypeId);
    return bodyType ? t(bodyType.translationKey as any) : bodyTypeId;
  };

  const getTransmissionName = (transmission: string) => {
    const transmissionMap: Record<string, string> = {
      manual: t('carFilters.transmissionManual' as any),
      automatic: t('carFilters.transmissionAutomatic' as any),
      robot: t('carFilters.transmissionRobot' as any),
      variator: t('carFilters.transmissionVariator' as any),
      'classic-automatic': t('carFilters.transmissionClassicAuto' as any),
    };
    return transmissionMap[transmission] || transmission;
  };

  const getDriveTypeName = (driveType: string) => {
    const driveTypeMap: Record<string, string> = {
      rear: t('carFilters.driveRear' as any),
      front: t('carFilters.driveFront' as any),
      all: t('carFilters.driveAll' as any),
    };
    return driveTypeMap[driveType] || driveType;
  };

  const getEngineTypeName = (engineType: string) => {
    const engineTypeMap: Record<string, string> = {
      petrol: t('carFilters.enginePetrol' as any),
      diesel: t('carFilters.engineDiesel' as any),
      electric: t('carFilters.engineElectric' as any),
      hybrid: t('carFilters.engineHybrid' as any),
      gas: t('carFilters.engineGas' as any),
    };
    return engineTypeMap[engineType] || engineType;
  };

  const getConditionName = (condition: string) => {
    const conditionMap: Record<string, string> = {
      new: t('carFilters.conditionNew' as any),
      used: t('carFilters.conditionUsed' as any),
    };
    return conditionMap[condition] || condition;
  };

  const getBodyConditionName = (bodyCondition: string) => {
    const bodyConditionMap: Record<string, string> = {
      'not-damaged': t('carFilters.bodyConditionNotDamaged' as any),
      damaged: t('carFilters.bodyConditionDamaged' as any),
    };
    return bodyConditionMap[bodyCondition] || bodyCondition;
  };

  const getSteeringPositionName = (position: string) => {
    const positionMap: Record<string, string> = {
      left: t('carFilters.steeringLeft' as any),
      right: t('carFilters.steeringRight' as any),
    };
    return positionMap[position] || position;
  };

  const specs: { icon: React.ReactNode; label: string; value: string | number }[] = [];

  // Condition
  if (listing.car_condition) {
    specs.push({
      icon: <CircleDot className="w-5 h-5" />,
      label: t('carFilters.condition' as any),
      value: getConditionName(listing.car_condition),
    });
  }

  // Brand & Model
  if (listing.car_brand) {
    const brandName = getBrandName(listing.car_brand);
    const modelName = listing.car_model ? getModelName(listing.car_brand, listing.car_model) : '';
    specs.push({
      icon: <Car className="w-5 h-5" />,
      label: t('carFilters.brand' as any),
      value: modelName ? `${brandName} ${modelName}` : brandName,
    });
  }

  // Year
  if (listing.car_year) {
    specs.push({
      icon: <Calendar className="w-5 h-5" />,
      label: t('carFilters.year' as any),
      value: listing.car_year,
    });
  }

  // Mileage
  if (listing.car_mileage !== null && listing.car_mileage !== undefined) {
    specs.push({
      icon: <Gauge className="w-5 h-5" />,
      label: t('carFilters.mileage' as any),
      value: `${listing.car_mileage.toLocaleString()} km`,
    });
  }

  // Body Type
  if (listing.car_body_type) {
    specs.push({
      icon: <Car className="w-5 h-5" />,
      label: t('carFilters.bodyType' as any),
      value: getBodyTypeName(listing.car_body_type),
    });
  }

  // Transmission
  if (listing.car_transmission) {
    specs.push({
      icon: <Settings className="w-5 h-5" />,
      label: t('carFilters.transmission' as any),
      value: getTransmissionName(listing.car_transmission),
    });
  }

  // Drive Type
  if (listing.car_drive_type) {
    specs.push({
      icon: <Compass className="w-5 h-5" />,
      label: t('carFilters.driveType' as any),
      value: getDriveTypeName(listing.car_drive_type),
    });
  }

  // Engine Type
  if (listing.car_engine_type) {
    specs.push({
      icon: <Fuel className="w-5 h-5" />,
      label: t('carFilters.engineType' as any),
      value: getEngineTypeName(listing.car_engine_type),
    });
  }

  // Engine Volume
  if (listing.car_engine_volume) {
    specs.push({
      icon: <Wrench className="w-5 h-5" />,
      label: t('carFilters.engineVolume' as any),
      value: `${listing.car_engine_volume} cc`,
    });
  }

  // Power
  if (listing.car_power) {
    specs.push({
      icon: <Zap className="w-5 h-5" />,
      label: t('carFilters.power' as any),
      value: `${listing.car_power} hp`,
    });
  }

  // Fuel Consumption
  if (listing.car_fuel_consumption) {
    specs.push({
      icon: <Fuel className="w-5 h-5" />,
      label: t('carFilters.fuelConsumption' as any),
      value: `${listing.car_fuel_consumption} L/100km`,
    });
  }

  // Body Condition
  if (listing.car_body_condition) {
    specs.push({
      icon: <Car className="w-5 h-5" />,
      label: t('carFilters.bodyCondition' as any),
      value: getBodyConditionName(listing.car_body_condition),
    });
  }

  // Seats
  if (listing.car_seats) {
    specs.push({
      icon: <Users className="w-5 h-5" />,
      label: t('carFilters.seats' as any),
      value: listing.car_seats,
    });
  }

  // Trunk Volume
  if (listing.car_trunk_volume) {
    specs.push({
      icon: <Package className="w-5 h-5" />,
      label: t('carFilters.trunkVolume' as any),
      value: `${listing.car_trunk_volume} L`,
    });
  }

  // Steering Position
  if (listing.car_steering_position) {
    specs.push({
      icon: <Compass className="w-5 h-5" />,
      label: t('carFilters.steeringPosition' as any),
      value: getSteeringPositionName(listing.car_steering_position),
    });
  }

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">
        {t('carFilters.title' as any)}
      </h2>
      <div className="bg-card rounded-2xl shadow-card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
            >
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
