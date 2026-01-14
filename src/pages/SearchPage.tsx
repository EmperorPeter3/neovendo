import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListings, ListingWithOwner } from '@/hooks/useListings';
import { SlidersHorizontal, X, MapPin, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { categoryIcons, subcategoriesData } from '@/data/subcategories';
import { CategoryModal } from '@/components/CategoryModal';
import { RegionSelector } from '@/components/RegionSelector';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

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

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') as Category | null;
  const subcategoryParam = searchParams.get('subcategory') || '';
  const countryParam = searchParams.get('country') || '';
  const cityParam = searchParams.get('city') || '';
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>(categoryParam || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedRegion, setSelectedRegion] = useState<{ country?: string; city?: string }>({
    country: countryParam || undefined,
    city: cityParam || undefined,
  });

  // Update local state when URL params change
  useEffect(() => {
    setSearchQuery(query);
    setSelectedCategory(categoryParam || '');
    setSelectedSubcategory(subcategoryParam);
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSelectedRegion({
      country: searchParams.get('country') || undefined,
      city: searchParams.get('city') || undefined,
    });
  }, [query, categoryParam, subcategoryParam, searchParams]);

  const { data: listings, isLoading } = useListings({
    search: query || undefined,
    category: selectedCategory || undefined,
    subcategory: selectedSubcategory || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    if (selectedRegion.country) params.set('country', selectedRegion.country);
    if (selectedRegion.city) params.set('city', selectedRegion.city);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryChange = (cat: Category | '', subcategory?: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(subcategory || '');
    
    // If subcategory is selected, redirect immediately
    if (subcategory) {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (cat) params.set('category', cat);
      params.set('subcategory', subcategory);
      if (selectedRegion.country) params.set('country', selectedRegion.country);
      if (selectedRegion.city) params.set('city', selectedRegion.city);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleCategoryFilterSelect = (category: Category | '') => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handleSubcategoryFilterSelect = (category: Category, subcategoryId: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategoryId);
  };

  const handleApplyFilters = () => {
    setSearchParams(prev => {
      if (selectedCategory) {
        prev.set('category', selectedCategory);
      } else {
        prev.delete('category');
      }
      if (selectedSubcategory) {
        prev.set('subcategory', selectedSubcategory);
      } else {
        prev.delete('subcategory');
      }
      if (minPrice) {
        prev.set('minPrice', minPrice);
      } else {
        prev.delete('minPrice');
      }
      if (maxPrice) {
        prev.set('maxPrice', maxPrice);
      } else {
        prev.delete('maxPrice');
      }
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(prev => {
      prev.delete('category');
      prev.delete('subcategory');
      prev.delete('minPrice');
      prev.delete('maxPrice');
      return prev;
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
            {/* Filter Button - Left of search */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t('filters')}
            </Button>

            {/* Category Modal */}
            <CategoryModal 
              value={selectedCategory} 
              onChange={handleCategoryChange} 
            />
            
            {/* Search Input with Button inside - Same as Index */}
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
            
            {/* Region Selector */}
            <RegionSelector 
              value={selectedRegion}
              onChange={setSelectedRegion}
            />
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
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder={t('maxPrice')}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                    {t('reset')}
                  </Button>
                  <Button onClick={handleApplyFilters} className="flex-1 gradient-hero text-primary-foreground">
                    {t('apply')}
                  </Button>
                </div>
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
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder={t('maxPrice')}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                    {t('reset')}
                  </Button>
                  <Button onClick={handleApplyFilters} className="flex-1 gradient-hero text-primary-foreground">
                    {t('apply')}
                  </Button>
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
