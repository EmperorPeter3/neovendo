import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListings, ListingWithOwner, CarsQueryFilters } from '@/hooks/useListings';
import { SlidersHorizontal, X, MapPin, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { subcategoriesData } from '@/data/subcategories';
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

import { RegionSelector } from '@/components/RegionSelector';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CarsFilters, CarsFiltersState, defaultCarsFilters } from '@/components/filters/CarsFilters';
import { Separator } from '@/components/ui/separator';
import { ListingCardLarge, ListingCardLargeSkeleton } from '@/components/ListingCardLarge';

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
  const [showFilters, setShowFilters] = useState(true); // Default open
  const [showCategoryList, setShowCategoryList] = useState(false); // Collapsed when category selected

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') as Category | null;
  const subcategoryParam = searchParams.get('subcategory') || '';
  const countryParam = searchParams.get('country') || '';
  const cityParam = searchParams.get('city') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [carsFilters, setCarsFilters] = useState<CarsFiltersState>(defaultCarsFilters);
  
  // Local state for price inputs with debounce
  const [localMinPrice, setLocalMinPrice] = useState(searchParams.get('minPrice') || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Derived state from URL params
  const selectedCategory = categoryParam || '';
  const selectedSubcategory = subcategoryParam;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const selectedRegion = {
    country: countryParam || undefined,
    city: cityParam || undefined,
  };

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
    if (filters.transmissionAutomatic === 'checked') transmissions.push('automatic');
    if (filters.transmissionRobot) transmissions.push('robot');
    if (filters.transmissionVariator) transmissions.push('variator');
    if (filters.transmissionClassic) transmissions.push('classic');
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
    country: selectedRegion.country || undefined,
    city: selectedRegion.city || undefined,
    cars: convertCarsFilters(carsFilters),
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
    updateFilters({
      category: category || undefined,
      subcategory: undefined,
    });
  };

  const handleSubcategoryFilterSelect = (category: Category, subcategoryId: string) => {
    updateFilters({
      category: category,
      subcategory: subcategoryId,
    });
  };

  const handleRegionChange = (region: { country?: string; city?: string }) => {
    updateFilters({
      country: region.country || undefined,
      city: region.city || undefined,
    });
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

  // Find current category for accordion default value
  const defaultAccordionValue = selectedCategory || undefined;

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

              {/* Region Selector */}
              <RegionSelector 
                value={selectedRegion}
                onChange={handleRegionChange}
                className="flex-1"
              />
            </div>

            {/* Mobile: Filter and Region buttons */}
            <div className="flex gap-3 md:hidden">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary flex-1"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {t('filters')}
              </Button>
              <RegionSelector 
                value={selectedRegion}
                onChange={handleRegionChange}
                className="flex-1"
              />
            </div>

            {/* Search Input with Button inside */}
            <div className="flex-1 relative flex">
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
          </div>
        </form>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-72 shrink-0 hidden md:block">
              <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-foreground">{t('filters')}</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('category')}
                  </label>
                  
                  {/* Collapsed category button when category is selected */}
                  {selectedCategory && !showCategoryList ? (
                    <button
                      onClick={() => setShowCategoryList(true)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground flex items-center gap-2"
                    >
                      {(() => {
                        const Icon = categoryIcons[selectedCategory];
                        return <Icon className="w-4 h-4" />;
                      })()}
                      <span className="flex-1">{t(selectedCategory as TranslationKey)}</span>
                      {selectedSubcategory && (
                        <span className="text-xs opacity-80">/ {t(selectedSubcategory as TranslationKey)}</span>
                      )}
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </button>
                  ) : (
                    <>
                      {/* All categories option */}
                      <button
                        onClick={() => {
                          handleCategoryFilterSelect('');
                          setShowCategoryList(false);
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
                        defaultValue={defaultAccordionValue}
                        className="space-y-1"
                      >
                        {categories.map(category => {
                          const Icon = categoryIcons[category];
                          const subcategories = subcategoriesData[category];
                          const isActive = selectedCategory === category;
                          
                          return (
                            <AccordionItem 
                              key={category} 
                              value={category}
                              className="border-none"
                            >
                              <AccordionTrigger 
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 hover:no-underline",
                                  isActive && !selectedSubcategory ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                                )}
                                onClick={(e) => {
                                  // If clicking on the main category (not chevron), select it
                                  if (!(e.target as HTMLElement).closest('svg.lucide-chevron-down')) {
                                    handleCategoryFilterSelect(category);
                                    setShowCategoryList(false);
                                  }
                                }}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="flex-1 text-left">{t(category as TranslationKey)}</span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-0 pt-1">
                                <div className="pl-6 space-y-1">
                                  {subcategories.map(subcategory => (
                                    <button
                                      key={subcategory.id}
                                      onClick={() => {
                                        handleSubcategoryFilterSelect(category, subcategory.id);
                                        setShowCategoryList(false);
                                      }}
                                      className={cn(
                                        "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                                        selectedCategory === category && selectedSubcategory === subcategory.id
                                          ? 'bg-primary/20 text-primary font-medium'
                                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                                      )}
                                    >
                                      {t(subcategory.id as TranslationKey)}
                                    </button>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </>
                  )}
                </div>

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

              </div>
            </div>
          )}

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="absolute inset-x-4 top-20 bg-card rounded-2xl shadow-card p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-foreground">{t('filters')}</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Category Filter with Accordion */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('category')}
                  </label>
                  
                  {/* All categories option */}
                  <button
                    onClick={() => handleCategoryFilterSelect('')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 mb-2",
                      !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
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
                    defaultValue={defaultAccordionValue}
                    className="space-y-1"
                  >
                    {categories.map(category => {
                      const Icon = categoryIcons[category];
                      const subcategories = subcategoriesData[category];
                      const isActive = selectedCategory === category;
                      
                      return (
                        <AccordionItem 
                          key={category} 
                          value={category}
                          className="border-none"
                        >
                          <AccordionTrigger 
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 hover:no-underline",
                              isActive && !selectedSubcategory ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                            )}
                            onClick={(e) => {
                              if (!(e.target as HTMLElement).closest('svg.lucide-chevron-down')) {
                                handleCategoryFilterSelect(category);
                              }
                            }}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{t(category as TranslationKey)}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0 pt-1">
                            <div className="pl-6 space-y-1">
                              {subcategories.map(subcategory => (
                                <button
                                  key={subcategory.id}
                                  onClick={() => handleSubcategoryFilterSelect(category, subcategory.id)}
                                  className={cn(
                                    "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                                    selectedCategory === category && selectedSubcategory === subcategory.id
                                      ? 'bg-primary/20 text-primary font-medium'
                                      : 'text-muted-foreground hover:text-foreground'
                                  )}
                                >
                                  {t(subcategory.id as TranslationKey)}
                                </button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>

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
