import { Layout } from '@/components/Layout';
import { CategoryModal } from '@/components/CategoryModal';
import { MobileCategorySelector } from '@/components/MobileCategorySelector';
import { LocationSelector } from '@/components/LocationSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListings, ListingWithOwner } from '@/hooks/useListings';
import { ChevronRight, MapPin, Search, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslationKey } from '@/i18n/translations';
import { useState } from 'react';
import { Category } from '@/types/listing';
import { categoryIcons } from '@/data/subcategories';
import { useIsMobile } from '@/hooks/use-mobile';
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

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: listings, isLoading } = useListings({ limit: 8 });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    radius: number;
  } | null>(null);

  const handleLocationChange = (location: typeof selectedLocation) => {
    setSelectedLocation(location);
    if (location) {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
      params.set('lat', location.lat.toString());
      params.set('lng', location.lng.toString());
      params.set('radius', location.radius.toString());
      params.set('address', location.address);
      navigate(`/search?${params.toString()}`);
    }
  };
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    if (selectedLocation) {
      params.set('lat', selectedLocation.lat.toString());
      params.set('lng', selectedLocation.lng.toString());
      params.set('radius', selectedLocation.radius.toString());
      params.set('address', selectedLocation.address);
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryChange = (cat: Category | '', subcategory?: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(subcategory);
    
    // If subcategory is selected, redirect to search immediately
    if (subcategory) {
      const params = new URLSearchParams();
      if (cat) params.set('category', cat);
      params.set('subcategory', subcategory);
      if (selectedLocation) {
        params.set('lat', selectedLocation.lat.toString());
        params.set('lng', selectedLocation.lng.toString());
        params.set('radius', selectedLocation.radius.toString());
        params.set('address', selectedLocation.address);
      }
      navigate(`/search?${params.toString()}`);
    }
  };

  // Get the icon for selected category
  const SelectedIcon = categoryIcons[selectedCategory] || categoryIcons[''];

  return (
    <Layout>
      {/* Search Section */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="container">
          <form onSubmit={handleSearch}>
            {/* Desktop layout: Category | Search | Region */}
            <div className="hidden md:flex flex-row gap-3 items-center w-full">
              <CategoryModal 
                value={selectedCategory} 
                onChange={handleCategoryChange} 
              />
              
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
              
              <LocationSelector 
                value={selectedLocation}
                onChange={handleLocationChange}
              />
            </div>

            {/* Mobile layout: Region -> Category -> Search (vertical) */}
            <div className="flex md:hidden flex-col gap-3 w-full">
              {/* 1. Location Selector - Full width */}
              <LocationSelector 
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full"
              />
              
              {/* 2. Category Button - Full width */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMobileCategories(true)}
                className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap justify-start w-full"
              >
                <SelectedIcon className="w-5 h-5 text-emerald-600" />
                <span className="truncate flex-1 text-left">
                  {selectedSubcategory 
                    ? t(selectedSubcategory as TranslationKey)
                    : selectedCategory 
                      ? t(selectedCategory as TranslationKey) 
                      : t('allCategories')}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </Button>
              
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
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Mobile Category Selector */}
      <MobileCategorySelector
        isOpen={showMobileCategories}
        onClose={() => setShowMobileCategories(false)}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory || ''}
        onSelectCategory={handleCategoryChange}
      />

      {/* Recent Listings Section */}
      <section className="py-6 md:py-10">
        <div className="container">
          <div className="flex items-center justify-between mb-6 gap-2">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              {t('recentListings')}
            </h2>
            <Link to="/search">
              <Button variant="ghost" className="gap-1 text-primary hover:text-primary/80 text-xs md:text-sm px-2 md:px-4 shrink-0">
                {t('viewAll')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ListingCardDB listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl">
              <p className="text-muted-foreground text-lg mb-4">{t('noListings')}</p>
              <Link to="/create">
                <Button className="gradient-hero text-primary-foreground">
                  {t('createListing')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default Index;
