import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListings, ListingWithOwner, CarsQueryFilters, AtvQueryFilters, KartingQueryFilters, QuadQueryFilters, MopedQueryFilters, MotoQueryFilters, SnowmobileQueryFilters, ApartmentQueryFilters } from '@/hooks/useListings';
import { SlidersHorizontal, X, MapPin, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { VoiceSearchButton } from '@/components/VoiceSearchButton';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { subcategoriesData, Subcategory } from '@/data/subcategories';
import { 
  Search as SearchIcon, 
  House, 
  Briefcase, 
  Wrench, 
  Shirt, 
  Sofa, 
  Cog, 
  Smartphone, 
  Palette, 
  PawPrint, 
  Building2,
  LucideIcon,
  CarFront,
} from 'lucide-react';

import { LocationSelector } from '@/components/LocationSelector';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CarsFilters, CarsFiltersState, defaultCarsFilters } from '@/components/filters/CarsFilters';
import { AtvFilters, AtvFiltersState, defaultAtvFilters } from '@/components/filters/AtvFilters';
import { KartingFilters, KartingFiltersState, defaultKartingFilters } from '@/components/filters/KartingFilters';
import { QuadFilters, QuadFiltersState, defaultQuadFilters } from '@/components/filters/QuadFilters';
import { MopedFilters, MopedFiltersState, defaultMopedFilters } from '@/components/filters/MopedFilters';
import { MotoFilters, MotoFiltersState, defaultMotoFilters } from '@/components/filters/MotoFilters';
import { SnowmobileFilters, SnowmobileFiltersState, defaultSnowmobileFilters } from '@/components/filters/SnowmobileFilters';
import { ApartmentFilters, ApartmentFiltersState, defaultApartmentFilters } from '@/components/filters/ApartmentFilters';
import { Separator } from '@/components/ui/separator';
import { ListingCardLarge, ListingCardLargeSkeleton } from '@/components/ListingCardLarge';
import { MobileCategorySelector } from '@/components/MobileCategorySelector';

const categories: Category[] = [
  'transport',
  'realEstate',
  'jobs',
  'services',
  'personalItems',
  'homeAndGarden',
  'autoParts',
  'electronics',
  'hobbies',
  'animals',
  'business',
];

// Local category icons with correct orientation
const categoryIcons: Record<Category | '', LucideIcon> = {
  '': SearchIcon,
  transport: CarFront,
  realEstate: House,
  jobs: Briefcase,
  services: Wrench,
  personalItems: Shirt,
  homeAndGarden: Sofa,
  autoParts: Cog,
  electronics: Smartphone,
  hobbies: Palette,
  animals: PawPrint,
  business: Building2,
};

const ListingCardDB = ({ listing }: { listing: ListingWithOwner }) => {
  const { t } = useLanguage();
  
  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
          {listing.images?.[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            (() => {
              const Icon = categoryIcons[listing.category as Category] || categoryIcons[''];
              return (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                  <Icon className="w-12 h-12 text-emerald-600" />
                </div>
              );
            })()
          )}
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-card/90 backdrop-blur-sm text-foreground">
            {t(listing.category as TranslationKey)}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="text-xl font-bold text-primary mb-2">
            €{Number(listing.price).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{listing.city}, {listing.country}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ListingCardSkeleton = () => (
  <div className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse">
    <div className="aspect-[4/3] bg-muted" />
    <div className="p-4">
      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
      <div className="h-6 bg-muted rounded w-1/3 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  </div>
);

const SearchPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true); // Default open for desktop
  const [showMobileCategories, setShowMobileCategories] = useState(false); // Mobile category selector
  const [showMobileFilters, setShowMobileFilters] = useState(false); // Mobile additional filters
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({}); // Track expanded subcategories
  const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>(undefined); // Controlled accordion state

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') as Category | null;
  const subcategoryParam = searchParams.get('subcategory') || '';
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const radiusParam = searchParams.get('radius');
  const addressParam = searchParams.get('address') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [carsFilters, setCarsFilters] = useState<CarsFiltersState>(defaultCarsFilters);
  const [atvFilters, setAtvFilters] = useState<AtvFiltersState>(defaultAtvFilters);
  const [kartingFilters, setKartingFilters] = useState<KartingFiltersState>(defaultKartingFilters);
  const [quadFilters, setQuadFilters] = useState<QuadFiltersState>(defaultQuadFilters);
  const [mopedFilters, setMopedFilters] = useState<MopedFiltersState>(defaultMopedFilters);
  const [motoFilters, setMotoFilters] = useState<MotoFiltersState>(defaultMotoFilters);
  const [snowmobileFilters, setSnowmobileFilters] = useState<SnowmobileFiltersState>(defaultSnowmobileFilters);
  const [apartmentFilters, setApartmentFilters] = useState<ApartmentFiltersState>(defaultApartmentFilters);
  
  // Local state for price inputs with debounce
  const [localMinPrice, setLocalMinPrice] = useState(searchParams.get('minPrice') || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Derived state from URL params
  const selectedCategory = categoryParam || '';
  const selectedSubcategory = subcategoryParam;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  
  // Location state derived from URL params
  const selectedLocation = latParam && lngParam ? {
    lat: parseFloat(latParam),
    lng: parseFloat(lngParam),
    address: addressParam,
    radius: radiusParam ? parseFloat(radiusParam) : 1,
  } : null;

  // Convert CarsFiltersState to CarsQueryFilters for the query
  const convertCarsFilters = (filters: CarsFiltersState): CarsQueryFilters | undefined => {
    if (selectedSubcategory !== 'cars') return undefined;

    const result: CarsQueryFilters = {};

    // Condition
    if (filters.condition !== 'all') {
      result.condition = filters.condition;
    }

    // Brands and models
    if (filters.brands.length > 0) {
      result.brands = filters.brands;
    }
    if (filters.models.length > 0) {
      result.models = filters.models;
    }

    // Year range
    if (filters.yearFrom) {
      result.yearFrom = Number(filters.yearFrom);
    }
    if (filters.yearTo) {
      result.yearTo = Number(filters.yearTo);
    }

    // Mileage range
    if (filters.mileageFrom) {
      result.mileageFrom = Number(filters.mileageFrom);
    }
    if (filters.mileageTo) {
      result.mileageTo = Number(filters.mileageTo);
    }

    // Transmissions
    const transmissions: string[] = [];
    if (filters.transmissionManual) transmissions.push('manual');
    if (filters.transmissionRobot) transmissions.push('robot');
    if (filters.transmissionVariator) transmissions.push('variator');
    if (filters.transmissionClassic) transmissions.push('classic-automatic');
    if (transmissions.length > 0) {
      result.transmissions = transmissions;
    }

    // Drive types
    const driveTypes: string[] = [];
    if (filters.driveRear) driveTypes.push('rear');
    if (filters.driveFront) driveTypes.push('front');
    if (filters.driveAll) driveTypes.push('all');
    if (driveTypes.length > 0) {
      result.driveTypes = driveTypes;
    }

    // Engine types
    const engineTypes: string[] = [];
    if (filters.enginePetrol) engineTypes.push('petrol');
    if (filters.engineGas) engineTypes.push('gas');
    if (filters.engineDiesel) engineTypes.push('diesel');
    if (filters.engineElectric) engineTypes.push('electric');
    if (filters.engineHybrid) engineTypes.push('hybrid');
    if (engineTypes.length > 0) {
      result.engineTypes = engineTypes;
    }

    // Engine volume range
    if (filters.engineVolumeFrom) {
      result.engineVolumeFrom = Number(filters.engineVolumeFrom) / 1000; // Convert cc to L
    }
    if (filters.engineVolumeTo) {
      result.engineVolumeTo = Number(filters.engineVolumeTo) / 1000;
    }

    // Fuel consumption range
    if (filters.fuelConsumptionFrom) {
      result.fuelConsumptionFrom = Number(filters.fuelConsumptionFrom);
    }
    if (filters.fuelConsumptionTo) {
      result.fuelConsumptionTo = Number(filters.fuelConsumptionTo);
    }

    // Power range
    if (filters.powerFrom) {
      result.powerFrom = Number(filters.powerFrom);
    }
    if (filters.powerTo) {
      result.powerTo = Number(filters.powerTo);
    }

    // Body condition
    if (filters.bodyCondition !== 'all') {
      result.bodyCondition = filters.bodyCondition;
    }

    // Body types
    if (filters.bodyTypes.length > 0) {
      result.bodyTypes = filters.bodyTypes;
    }

    // Seats range
    if (filters.seatsFrom) {
      result.seatsFrom = Number(filters.seatsFrom);
    }
    if (filters.seatsTo) {
      result.seatsTo = Number(filters.seatsTo);
    }

    // Trunk volume range
    if (filters.trunkVolumeFrom) {
      result.trunkVolumeFrom = Number(filters.trunkVolumeFrom);
    }
    if (filters.trunkVolumeTo) {
      result.trunkVolumeTo = Number(filters.trunkVolumeTo);
    }

    // Steering position
    if (filters.steeringPosition !== 'any') {
      result.steeringPosition = filters.steeringPosition;
    }

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert AtvFiltersState to AtvQueryFilters for the query
  const convertAtvFilters = (filters: AtvFiltersState): AtvQueryFilters | undefined => {
    if (selectedSubcategory !== 'atvs') return undefined;

    const result: AtvQueryFilters = {};

    // Types
    const types: string[] = [];
    if (filters.typeTracked) types.push('tracked');
    if (filters.typeWheeled) types.push('wheeled');
    if (filters.typeHomemade) types.push('homemade');
    if (types.length > 0) result.types = types;

    if (filters.brand) result.brand = filters.brand;
    if (filters.originCountries.length > 0) result.originCountries = filters.originCountries;
    if (filters.yearFrom) result.yearFrom = Number(filters.yearFrom);
    if (filters.yearTo) result.yearTo = Number(filters.yearTo);
    if (filters.condition !== 'all') result.condition = filters.condition;

    const engineTypes: string[] = [];
    if (filters.enginePetrol) engineTypes.push('petrol');
    if (filters.engineDiesel) engineTypes.push('diesel');
    if (filters.engineElectric) engineTypes.push('electric');
    if (engineTypes.length > 0) result.engineTypes = engineTypes;

    if (filters.engineVolumeFrom) result.engineVolumeFrom = Number(filters.engineVolumeFrom);
    if (filters.engineVolumeTo) result.engineVolumeTo = Number(filters.engineVolumeTo);
    if (filters.powerFrom) result.powerFrom = Number(filters.powerFrom);
    if (filters.powerTo) result.powerTo = Number(filters.powerTo);
    if (filters.powerWattFrom) result.powerWattFrom = Number(filters.powerWattFrom);
    if (filters.powerWattTo) result.powerWattTo = Number(filters.powerWattTo);
    if (filters.mileageFrom) result.mileageFrom = Number(filters.mileageFrom);
    if (filters.mileageTo) result.mileageTo = Number(filters.mileageTo);
    if (filters.maxPassengersFrom) result.maxPassengersFrom = Number(filters.maxPassengersFrom);
    if (filters.maxPassengersTo) result.maxPassengersTo = Number(filters.maxPassengersTo);
    if (filters.descriptionSearch) result.descriptionSearch = filters.descriptionSearch;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert KartingFiltersState to KartingQueryFilters for the query
  const convertKartingFilters = (filters: KartingFiltersState): KartingQueryFilters | undefined => {
    if (selectedSubcategory !== 'karting') return undefined;

    const result: KartingQueryFilters = {};

    if (filters.condition !== 'all') result.condition = filters.condition;
    if (filters.descriptionSearch) result.descriptionSearch = filters.descriptionSearch;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert QuadFiltersState to QuadQueryFilters for the query
  const convertQuadFilters = (filters: QuadFiltersState): QuadQueryFilters | undefined => {
    if (selectedSubcategory !== 'quads_buggies') return undefined;

    const result: QuadQueryFilters = {};

    // Types
    const types: string[] = [];
    if (filters.typeBuggy) types.push('buggy');
    if (filters.typeUtility) types.push('utility');
    if (filters.typeSport) types.push('sport');
    if (filters.typeTouring) types.push('touring');
    if (filters.typeKids) types.push('kids');
    if (types.length > 0) result.types = types;

    if (filters.brand) result.brand = filters.brand;
    if (filters.originCountries.length > 0) result.originCountries = filters.originCountries;
    if (filters.yearFrom) result.yearFrom = Number(filters.yearFrom);
    if (filters.yearTo) result.yearTo = Number(filters.yearTo);
    if (filters.condition !== 'all') result.condition = filters.condition;

    const engineTypes: string[] = [];
    if (filters.enginePetrol) engineTypes.push('petrol');
    if (filters.engineElectric) engineTypes.push('electric');
    if (engineTypes.length > 0) result.engineTypes = engineTypes;

    if (filters.engineVolumeFrom) result.engineVolumeFrom = Number(filters.engineVolumeFrom);
    if (filters.engineVolumeTo) result.engineVolumeTo = Number(filters.engineVolumeTo);
    if (filters.powerFrom) result.powerFrom = Number(filters.powerFrom);
    if (filters.powerTo) result.powerTo = Number(filters.powerTo);
    if (filters.powerWattFrom) result.powerWattFrom = Number(filters.powerWattFrom);
    if (filters.powerWattTo) result.powerWattTo = Number(filters.powerWattTo);
    if (filters.mileageFrom) result.mileageFrom = Number(filters.mileageFrom);
    if (filters.mileageTo) result.mileageTo = Number(filters.mileageTo);
    if (filters.maxPassengersFrom) result.maxPassengersFrom = Number(filters.maxPassengersFrom);
    if (filters.maxPassengersTo) result.maxPassengersTo = Number(filters.maxPassengersTo);
    if (filters.descriptionSearch) result.descriptionSearch = filters.descriptionSearch;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert MopedFiltersState to MopedQueryFilters for the query
  const convertMopedFilters = (filters: MopedFiltersState): MopedQueryFilters | undefined => {
    if (selectedSubcategory !== 'mopeds_scooters') return undefined;

    const result: MopedQueryFilters = {};

    const types: string[] = [];
    if (filters.typeScooter) types.push('scooter');
    if (filters.typeMaxiScooter) types.push('maxi_scooter');
    if (filters.typeMoped) types.push('moped');
    if (filters.typeMiniBike) types.push('mini_bike');
    if (types.length > 0) result.types = types;

    if (filters.brand) result.brand = filters.brand;
    if (filters.originCountries.length > 0) result.originCountries = filters.originCountries;
    if (filters.yearFrom) result.yearFrom = Number(filters.yearFrom);
    if (filters.yearTo) result.yearTo = Number(filters.yearTo);
    if (filters.condition !== 'all') result.condition = filters.condition;

    const engineTypes: string[] = [];
    if (filters.enginePetrol) engineTypes.push('petrol');
    if (filters.engineElectric) engineTypes.push('electric');
    if (engineTypes.length > 0) result.engineTypes = engineTypes;

    if (filters.engineVolumeFrom) result.engineVolumeFrom = Number(filters.engineVolumeFrom);
    if (filters.engineVolumeTo) result.engineVolumeTo = Number(filters.engineVolumeTo);
    if (filters.powerFrom) result.powerFrom = Number(filters.powerFrom);
    if (filters.powerTo) result.powerTo = Number(filters.powerTo);
    if (filters.powerWattFrom) result.powerWattFrom = Number(filters.powerWattFrom);
    if (filters.powerWattTo) result.powerWattTo = Number(filters.powerWattTo);
    if (filters.mileageFrom) result.mileageFrom = Number(filters.mileageFrom);
    if (filters.mileageTo) result.mileageTo = Number(filters.mileageTo);
    if (filters.descriptionSearch) result.descriptionSearch = filters.descriptionSearch;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert MotoFiltersState to MotoQueryFilters for the query
  const convertMotoFilters = (filters: MotoFiltersState): MotoQueryFilters | undefined => {
    if (selectedSubcategory !== 'motorbikes') return undefined;

    const result: MotoQueryFilters = {};

    const types: string[] = [];
    if (filters.typeCruiserChopper) types.push('cruiser_chopper');
    if (filters.typeSportbike) types.push('sportbike');
    if (filters.typeTouring) types.push('touring');
    if (filters.typeSportTouring) types.push('sport_touring');
    if (filters.typeTourEnduro) types.push('tour_enduro');
    if (filters.typeTrike) types.push('trike');
    if (filters.typeNaked) types.push('naked');
    if (filters.typeMotard) types.push('motard');
    if (filters.typeEnduro) types.push('enduro');
    if (filters.typeCross) types.push('cross');
    if (filters.typePitbike) types.push('pitbike');
    if (filters.typeTrial) types.push('trial');
    if (filters.typeKids) types.push('kids');
    if (filters.typeCustom) types.push('custom');
    if (types.length > 0) result.types = types;

    if (filters.brand) result.brand = filters.brand;
    if (filters.originCountries.length > 0) result.originCountries = filters.originCountries;
    if (filters.yearFrom) result.yearFrom = Number(filters.yearFrom);
    if (filters.yearTo) result.yearTo = Number(filters.yearTo);
    if (filters.condition !== 'all') result.condition = filters.condition;

    const engineTypes: string[] = [];
    if (filters.enginePetrol) engineTypes.push('petrol');
    if (filters.engineElectric) engineTypes.push('electric');
    if (engineTypes.length > 0) result.engineTypes = engineTypes;

    if (filters.engineVolumeFrom) result.engineVolumeFrom = Number(filters.engineVolumeFrom);
    if (filters.engineVolumeTo) result.engineVolumeTo = Number(filters.engineVolumeTo);
    if (filters.powerHpFrom) result.powerHpFrom = Number(filters.powerHpFrom);
    if (filters.powerHpTo) result.powerHpTo = Number(filters.powerHpTo);
    if (filters.powerWattFrom) result.powerWattFrom = Number(filters.powerWattFrom);
    if (filters.powerWattTo) result.powerWattTo = Number(filters.powerWattTo);
    if (filters.fuelDelivery) result.fuelDelivery = filters.fuelDelivery;
    if (filters.strokes) result.strokes = Number(filters.strokes);
    if (filters.transmission.length > 0) result.transmissions = filters.transmission;
    if (filters.driveType.length > 0) result.driveTypes = filters.driveType;
    if (filters.cylinders) result.cylinders = Number(filters.cylinders);
    if (filters.gears) result.gears = Number(filters.gears);
    if (filters.cooling) result.cooling = filters.cooling;
    if (filters.mileageFrom) result.mileageFrom = Number(filters.mileageFrom);
    if (filters.mileageTo) result.mileageTo = Number(filters.mileageTo);
    if (filters.descriptionSearch) result.descriptionSearch = filters.descriptionSearch;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert SnowmobileFiltersState to SnowmobileQueryFilters
  const convertSnowmobileFilters = (filters: SnowmobileFiltersState): SnowmobileQueryFilters | undefined => {
    if (selectedSubcategory !== 'snowmobiles') return undefined;

    const result: SnowmobileQueryFilters = {};

    const types: string[] = [];
    if (filters.typeUtility) types.push('utility');
    if (filters.typeSportMountain) types.push('sport_mountain');
    if (filters.typeTouring) types.push('touring');
    if (filters.typeKids) types.push('kids');
    if (filters.typeMotobuksir) types.push('motobuksir');
    if (types.length > 0) result.types = types;

    if (filters.brand) result.brand = filters.brand;
    if (filters.originCountries.length > 0) result.originCountries = filters.originCountries;
    if (filters.yearFrom) result.yearFrom = Number(filters.yearFrom);
    if (filters.yearTo) result.yearTo = Number(filters.yearTo);
    if (filters.condition !== 'all') result.condition = filters.condition;

    const engineTypes: string[] = [];
    if (filters.enginePetrol) engineTypes.push('petrol');
    if (filters.engineElectric) engineTypes.push('electric');
    if (engineTypes.length > 0) result.engineTypes = engineTypes;

    if (filters.engineVolumeFrom) result.engineVolumeFrom = Number(filters.engineVolumeFrom);
    if (filters.engineVolumeTo) result.engineVolumeTo = Number(filters.engineVolumeTo);
    if (filters.powerFrom) result.powerFrom = Number(filters.powerFrom);
    if (filters.powerTo) result.powerTo = Number(filters.powerTo);
    if (filters.powerWattFrom) result.powerWattFrom = Number(filters.powerWattFrom);
    if (filters.powerWattTo) result.powerWattTo = Number(filters.powerWattTo);
    if (filters.mileageFrom) result.mileageFrom = Number(filters.mileageFrom);
    if (filters.mileageTo) result.mileageTo = Number(filters.mileageTo);
    if (filters.maxPassengersFrom) result.maxPassengersFrom = Number(filters.maxPassengersFrom);
    if (filters.maxPassengersTo) result.maxPassengersTo = Number(filters.maxPassengersTo);
    if (filters.trackWidthFrom) result.trackWidthFrom = Number(filters.trackWidthFrom);
    if (filters.trackWidthTo) result.trackWidthTo = Number(filters.trackWidthTo);
    if (filters.descriptionSearch) result.descriptionSearch = filters.descriptionSearch;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Convert ApartmentFiltersState to ApartmentQueryFilters
  const isApartmentSubcategory = selectedSubcategory === 'buy_all_apartments' || selectedSubcategory === 'buy_secondary' || selectedSubcategory === 'buy_new';
  
  const convertApartmentFilters = (filters: ApartmentFiltersState): ApartmentQueryFilters | undefined => {
    if (!isApartmentSubcategory) return undefined;

    const result: ApartmentQueryFilters = {};

    if (filters.rooms.length > 0) result.rooms = filters.rooms;
    if (filters.mortgage) result.mortgage = true;
    if (filters.pricePerSqmFrom) result.pricePerSqmFrom = Number(filters.pricePerSqmFrom);
    if (filters.pricePerSqmTo) result.pricePerSqmTo = Number(filters.pricePerSqmTo);
    if (filters.areaFrom) result.areaFrom = Number(filters.areaFrom);
    if (filters.areaTo) result.areaTo = Number(filters.areaTo);
    if (filters.floorFrom) result.floorFrom = Number(filters.floorFrom);
    if (filters.floorTo) result.floorTo = Number(filters.floorTo);
    if (filters.notFirstFloor) result.notFirstFloor = true;
    if (filters.notLastFloor) result.notLastFloor = true;
    if (filters.onlyLastFloor) result.onlyLastFloor = true;
    if (filters.housingType !== 'all') result.housingType = filters.housingType;
    if (filters.sellerType !== 'all') result.sellerType = filters.sellerType;
    if (filters.bathroom) result.bathroom = filters.bathroom;
    if (filters.windows.length > 0) result.windows = filters.windows;
    if (filters.buildYearFrom) result.buildYearFrom = Number(filters.buildYearFrom);
    if (filters.buildYearTo) result.buildYearTo = Number(filters.buildYearTo);
    if (filters.totalFloorsFrom) result.totalFloorsFrom = Number(filters.totalFloorsFrom);
    if (filters.totalFloorsTo) result.totalFloorsTo = Number(filters.totalFloorsTo);
    if (filters.buildingType !== 'any') result.buildingType = filters.buildingType;
    if (filters.elevators.length > 0) result.elevators = filters.elevators;
    if (filters.parkings.length > 0) result.parkings = filters.parkings;
    if (filters.renovation) result.renovation = filters.renovation;
    if (filters.kitchenAreaFrom) result.kitchenAreaFrom = Number(filters.kitchenAreaFrom);
    if (filters.kitchenAreaTo) result.kitchenAreaTo = Number(filters.kitchenAreaTo);
    if (filters.roomType) result.roomType = filters.roomType;
    if (filters.balconies.length > 0) result.balconies = filters.balconies;
    if (filters.ceilingHeightFrom) result.ceilingHeightFrom = Number(filters.ceilingHeightFrom);
    if (filters.ceilingHeightTo) result.ceilingHeightTo = Number(filters.ceilingHeightTo);
    if (filters.photosOnly) result.photosOnly = true;

    return Object.keys(result).length > 0 ? result : undefined;
  };

  // Update search query and local prices when URL changes
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Debounce price filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMinPrice !== minPrice || localMaxPrice !== maxPrice) {
        const params = new URLSearchParams(searchParams);
        if (localMinPrice) {
          params.set('minPrice', localMinPrice);
        } else {
          params.delete('minPrice');
        }
        if (localMaxPrice) {
          params.set('maxPrice', localMaxPrice);
        } else {
          params.delete('maxPrice');
        }
        setSearchParams(params, { replace: true });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localMinPrice, localMaxPrice]);

  // Helper to update URL params
  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const { data: listings, isLoading } = useListings({
    search: query || undefined,
    category: selectedCategory || undefined,
    subcategory: selectedSubcategory || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    lat: selectedLocation?.lat,
    lng: selectedLocation?.lng,
    radius: selectedLocation?.radius,
    cars: convertCarsFilters(carsFilters),
    atvs: convertAtvFilters(atvFilters),
    karting: convertKartingFilters(kartingFilters),
    quads: convertQuadFilters(quadFilters),
    mopeds: convertMopedFilters(mopedFilters),
    motos: convertMotoFilters(motoFilters),
    snowmobiles: convertSnowmobileFilters(snowmobileFilters),
    apartments: convertApartmentFilters(apartmentFilters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchQuery || undefined });
  };

  const handleCategoryChange = (cat: Category | '', subcategory?: string) => {
    updateFilters({
      category: cat || undefined,
      subcategory: subcategory || undefined,
    });
  };

  const handleCategoryFilterSelect = (category: Category | '') => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('subcategory');
    setSearchParams(params, { replace: false });
  };

  const handleSubcategoryFilterSelect = (category: Category, subcategoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    params.set('subcategory', subcategoryId);
    setSearchParams(params, { replace: false });
  };

  const handleLocationChange = (location: { lat: number; lng: number; address: string; radius: number } | null) => {
    const params = new URLSearchParams(searchParams);
    if (location) {
      params.set('lat', location.lat.toString());
      params.set('lng', location.lng.toString());
      params.set('radius', location.radius.toString());
      params.set('address', location.address);
    } else {
      params.delete('lat');
      params.delete('lng');
      params.delete('radius');
      params.delete('address');
    }
    setSearchParams(params, { replace: true });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setLocalMinPrice(value);
    } else {
      setLocalMaxPrice(value);
    }
  };

  const handleResetFilters = () => {
    updateFilters({
      category: undefined,
      subcategory: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  // Auto-expand accordion and subcategories based on URL params
  useEffect(() => {
    if (selectedCategory) {
      setOpenAccordionValue(selectedCategory);
      
      // Also expand parent subcategory if a child is selected
      if (selectedSubcategory) {
        const categoryData = subcategoriesData[selectedCategory];
        if (categoryData) {
          for (const sub of categoryData) {
            if (sub.children) {
              const isChildSelected = sub.children.some(child => child.id === selectedSubcategory);
              if (isChildSelected) {
                setExpandedSubcategories(prev => ({
                  ...prev,
                  [sub.id]: true
                }));
                break;
              }
            }
          }
        }
      }
    }
  }, [selectedCategory, selectedSubcategory]);

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Search Header - Same as Index page */}
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full mb-8">
            {/* Left: Filter Button + Region Selector in row (same width as filter card) */}
            <div className="w-72 shrink-0 hidden md:flex flex-row gap-2">
              {/* Filter Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary flex-1 justify-center"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {t('filters')}
              </Button>

              {/* Location Selector */}
              <LocationSelector 
                value={selectedLocation}
                onChange={handleLocationChange}
                className="flex-1"
              />
            </div>

            {/* Mobile: Reorganized layout - Location, then Category+Filters, then Search */}
            <div className="flex flex-col gap-3 md:hidden w-full">
              {/* 1. Location Selector - Full width */}
              <LocationSelector 
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full"
              />
              
              {/* 2. Category and Filters buttons - Side by side */}
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMobileCategories(true)}
                  className="h-12 px-3 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary flex-1 min-w-0"
                >
                  <SlidersHorizontal className="w-5 h-5 shrink-0" />
                  <span className="truncate">{t('category')}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMobileFilters(true)}
                  className="h-12 px-3 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary flex-1 min-w-0"
                >
                  <SlidersHorizontal className="w-5 h-5 shrink-0" />
                  <span className="truncate">{t('filters')}</span>
                </Button>
              </div>
              
              {/* 3. Search Input with Button - Full width */}
              <div className="relative flex w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="h-12 pl-12 pr-4 text-base rounded-xl rounded-r-none border-2 border-r-0 border-border bg-card flex-1 min-w-0"
                />
                <Button
                  type="submit"
                  className="h-12 px-4 gradient-hero text-primary-foreground hover:opacity-90 transition-opacity rounded-xl rounded-l-none shrink-0"
                >
                  {t('search')}
                </Button>
                <VoiceSearchButton className="ml-1" />
              </div>
              
              {/* 4. Category path - Clickable, shows when category is selected */}
              {(selectedCategory || selectedSubcategory) && (
                <button
                  type="button"
                  onClick={() => setShowMobileCategories(true)}
                  className="text-left text-sm text-primary hover:underline flex items-center gap-1 flex-wrap"
                >
                  {selectedCategory && (
                    <>
                      <span>{t(selectedCategory as TranslationKey)}</span>
                      {selectedSubcategory && (
                        <>
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          {(() => {
                            // Find the subcategory name
                            const subs = subcategoriesData[selectedCategory as Category];
                            if (subs) {
                              for (const sub of subs) {
                                if (sub.id === selectedSubcategory) {
                                  return <span>{t(sub.translationKey as TranslationKey)}</span>;
                                }
                                if (sub.children) {
                                  for (const child of sub.children) {
                                    if (child.id === selectedSubcategory) {
                                      return (
                                        <>
                                          <span>{t(sub.translationKey as TranslationKey)}</span>
                                          <ChevronRight className="w-3 h-3 shrink-0" />
                                          <span>{t(child.translationKey as TranslationKey)}</span>
                                        </>
                                      );
                                    }
                                  }
                                }
                              }
                            }
                            return <span>{selectedSubcategory}</span>;
                          })()}
                        </>
                      )}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Desktop: Search Input with Button inside */}
            <div className="flex-1 relative hidden md:flex">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="h-12 pl-12 pr-4 text-base rounded-xl rounded-r-none border-2 border-r-0 border-border bg-card flex-1"
              />
              <Button
                type="submit"
                className="h-12 px-6 gradient-hero text-primary-foreground hover:opacity-90 transition-opacity rounded-xl rounded-l-none"
              >
                {t('search')}
              </Button>
            </div>
            
            <VoiceSearchButton />
          </div>
        </form>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-72 shrink-0 hidden md:block">
              <div className="bg-card rounded-2xl shadow-card p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-foreground">{t('filters')}</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('category')}
                  </label>
                  
                  {/* All categories option */}
                  <button
                    onClick={() => {
                      handleCategoryFilterSelect('');
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 mb-2",
                      !selectedCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    )}
                  >
                    {(() => {
                      const AllIcon = categoryIcons[''];
                      return <AllIcon className="w-4 h-4" />;
                    })()}
                    {t('all')}
                  </button>

                      <Accordion 
                        type="single" 
                        collapsible 
                        value={openAccordionValue}
                        onValueChange={setOpenAccordionValue}
                        className="space-y-1"
                      >
                        {categories.map(category => {
                          const Icon = categoryIcons[category];
                          const subcategories = subcategoriesData[category];
                          
                          // Check if this category is a parent of the selected subcategory
                          const isParentOfSelected = selectedCategory === category && selectedSubcategory;
                          
                          // Helper to check if a subcategory is a parent of the selected one
                          const isParentSubcategory = (sub: Subcategory): boolean => {
                            if (!selectedSubcategory || selectedCategory !== category) return false;
                            if (sub.children) {
                              return sub.children.some(child => child.id === selectedSubcategory);
                            }
                            return false;
                          };
                          
                          return (
                            <AccordionItem 
                              key={category} 
                              value={category}
                              className="border-none"
                            >
                              <AccordionTrigger 
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 hover:no-underline",
                                  isParentOfSelected 
                                    ? 'bg-muted text-foreground font-medium'
                                    : 'hover:bg-secondary'
                                )}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="flex-1 text-left">{t(category as TranslationKey)}</span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-0 pt-1">
                                <div className="pl-6 space-y-1">
                                  {subcategories.map(subcategory => {
                                    const hasChildren = subcategory.children && subcategory.children.length > 0;
                                    const isExpanded = expandedSubcategories[subcategory.id] ?? false;
                                    const isSelected = selectedCategory === category && selectedSubcategory === subcategory.id;
                                    const isParent = isParentSubcategory(subcategory);
                                    
                                    return (
                                      <div key={subcategory.id}>
                                        <button
                                        onClick={() => {
                                            if (hasChildren) {
                                              setExpandedSubcategories(prev => ({
                                                ...prev,
                                                [subcategory.id]: !prev[subcategory.id]
                                              }));
                                            } else {
                                              handleSubcategoryFilterSelect(category, subcategory.id);
                                            }
                                          }}
                                          className={cn(
                                            "w-full text-left px-2 py-1 rounded-lg text-xs transition-colors flex items-center justify-between",
                                            isSelected
                                              ? 'bg-primary/20 text-primary font-medium'
                                              : isParent
                                                ? 'bg-muted/60 text-foreground font-medium'
                                                : 'hover:bg-secondary text-muted-foreground hover:text-foreground',
                                            hasChildren && !isSelected && !isParent && 'font-medium text-foreground'
                                          )}
                                        >
                                          <span>{t(subcategory.id as TranslationKey)}</span>
                                          {hasChildren && (
                                            isExpanded 
                                              ? <ChevronDown className="w-3 h-3 shrink-0" />
                                              : <ChevronRight className="w-3 h-3 shrink-0" />
                                          )}
                                        </button>
                                        {/* Render nested children - collapsible */}
                                        {hasChildren && isExpanded && (
                                          <div className="pl-4 space-y-1 mt-1">
                                            {subcategory.children!.map(child => (
                                              <button
                                                key={child.id}
                                                onClick={() => {
                                                  handleSubcategoryFilterSelect(category, child.id);
                                                }}
                                                className={cn(
                                                  "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                                                  selectedCategory === category && selectedSubcategory === child.id
                                                    ? 'bg-primary/20 text-primary font-medium'
                                                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                                                )}
                                              >
                                                {t(child.id as TranslationKey)}
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('priceRange')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={t('minPrice')}
                      value={localMinPrice}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder={t('maxPrice')}
                      value={localMaxPrice}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Subcategory-specific filters */}
                {selectedSubcategory === 'cars' && (
                  <>
                    <Separator className="my-4" />
                    <CarsFilters filters={carsFilters} onChange={setCarsFilters} />
                  </>
                )}
                {selectedSubcategory === 'atvs' && (
                  <>
                    <Separator className="my-4" />
                    <AtvFilters filters={atvFilters} onChange={setAtvFilters} />
                  </>
                )}
                {selectedSubcategory === 'karting' && (
                  <>
                    <Separator className="my-4" />
                    <KartingFilters filters={kartingFilters} onChange={setKartingFilters} />
                  </>
                )}
                {selectedSubcategory === 'quads_buggies' && (
                  <>
                    <Separator className="my-4" />
                    <QuadFilters filters={quadFilters} onChange={setQuadFilters} />
                  </>
                )}
                {selectedSubcategory === 'mopeds_scooters' && (
                  <>
                    <Separator className="my-4" />
                    <MopedFilters filters={mopedFilters} onChange={setMopedFilters} />
                  </>
                )}
                {selectedSubcategory === 'motorbikes' && (
                  <>
                    <Separator className="my-4" />
                    <MotoFilters filters={motoFilters} onChange={setMotoFilters} />
                  </>
                )}
                {selectedSubcategory === 'snowmobiles' && (
                  <>
                    <Separator className="my-4" />
                    <SnowmobileFilters filters={snowmobileFilters} onChange={setSnowmobileFilters} />
                  </>
                )}
                {isApartmentSubcategory && (
                  <>
                    <Separator className="my-4" />
                    <ApartmentFilters filters={apartmentFilters} onChange={setApartmentFilters} />
                  </>
                )}

              </div>
            </div>
          )}

          {/* Mobile Category Filter - Fullscreen */}
          <MobileCategorySelector
            isOpen={showMobileCategories}
            onClose={() => setShowMobileCategories(false)}
            selectedCategory={selectedCategory as Category | ''}
            selectedSubcategory={selectedSubcategory}
            onSelectCategory={(category, subcategory) => {
              if (subcategory) {
                handleSubcategoryFilterSelect(category as Category, subcategory);
              } else {
                handleCategoryFilterSelect(category);
              }
            }}
          />

          {/* Mobile Additional Filters - Fullscreen */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-semibold text-foreground">{t('filters')}</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Price Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('priceRange')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={t('minPrice')}
                      value={localMinPrice}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder={t('maxPrice')}
                      value={localMaxPrice}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Subcategory-specific filters */}
                {selectedSubcategory === 'cars' && (
                  <>
                    <Separator className="my-4" />
                    <CarsFilters filters={carsFilters} onChange={setCarsFilters} />
                  </>
                )}
                {selectedSubcategory === 'atvs' && (
                  <>
                    <Separator className="my-4" />
                    <AtvFilters filters={atvFilters} onChange={setAtvFilters} />
                  </>
                )}
                {selectedSubcategory === 'karting' && (
                  <>
                    <Separator className="my-4" />
                    <KartingFilters filters={kartingFilters} onChange={setKartingFilters} />
                  </>
                )}
                {selectedSubcategory === 'quads_buggies' && (
                  <>
                    <Separator className="my-4" />
                    <QuadFilters filters={quadFilters} onChange={setQuadFilters} />
                  </>
                )}
                {selectedSubcategory === 'mopeds_scooters' && (
                  <>
                    <Separator className="my-4" />
                    <MopedFilters filters={mopedFilters} onChange={setMopedFilters} />
                  </>
                )}
                {selectedSubcategory === 'motorbikes' && (
                  <>
                    <Separator className="my-4" />
                    <MotoFilters filters={motoFilters} onChange={setMotoFilters} />
                  </>
                )}
                {selectedSubcategory === 'snowmobiles' && (
                  <>
                    <Separator className="my-4" />
                    <SnowmobileFilters filters={snowmobileFilters} onChange={setSnowmobileFilters} />
                  </>
                )}
                {isApartmentSubcategory && (
                  <>
                    <Separator className="my-4" />
                    <ApartmentFilters filters={apartmentFilters} onChange={setApartmentFilters} />
                  </>
                )}
              </div>

              {/* Apply button */}
              <div className="p-4 border-t border-border">
                <Button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full gradient-hero text-primary-foreground"
                >
                  {t('applyFilters')}
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">
                {t('listings')} ({listings?.length || 0})
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map(i => (
                  <ListingCardLargeSkeleton key={i} />
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="flex flex-col gap-4">
                {listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ListingCardLarge listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t('noListings')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
