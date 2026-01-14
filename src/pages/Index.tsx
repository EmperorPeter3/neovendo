import { Layout } from '@/components/Layout';
import { CategoryModal } from '@/components/CategoryModal';
import { RegionSelector } from '@/components/RegionSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListings, ListingWithOwner } from '@/hooks/useListings';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslationKey } from '@/i18n/translations';
import { useState } from 'react';
import { Category } from '@/types/listing';

const categoryIcons: Record<string, string> = {
  electronics: '📱',
  furniture: '🛋️',
  jobs: '💼',
  services: '🔧',
  realEstate: '🏠',
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
            <div className="w-full h-full flex items-center justify-center text-5xl bg-secondary/50">
              {categoryIcons[listing.category]}
            </div>
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
  const { data: listings, isLoading } = useListings({ limit: 8 });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedRegion, setSelectedRegion] = useState<{ country?: string; city?: string }>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedRegion.country) params.set('country', selectedRegion.country);
    if (selectedRegion.city) params.set('city', selectedRegion.city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Search Section */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="container">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full">
              {/* Category Modal */}
              <CategoryModal 
                value={selectedCategory} 
                onChange={(cat) => setSelectedCategory(cat)} 
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
              
              {/* Region Selector */}
              <RegionSelector 
                value={selectedRegion}
                onChange={setSelectedRegion}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {t('recentListings')}
            </h2>
            <Link to="/search">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                {t('viewAll')}
                <ArrowRight className="w-4 h-4" />
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
