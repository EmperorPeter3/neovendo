import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListings, ListingWithOwner } from '@/hooks/useListings';
import { categories } from '@/data/mockListings';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TranslationKey } from '@/i18n/translations';
import heroIllustration from '@/assets/hero-illustration.png';

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
  const { data: listings, isLoading } = useListings({ limit: 8 });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left animate-fade-in">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 text-balance">
                {t('heroSubtitle')}
              </p>
              <div className="max-w-xl">
                <SearchBar variant="hero" />
              </div>
            </div>
            
            <div className="hidden md:block animate-slide-up" style={{ animationDelay: '100ms' }}>
              <img 
                src={heroIllustration} 
                alt="Online marketplace illustration" 
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {t('categories')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
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

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden gradient-hero p-8 md:p-12 lg:p-16 text-center">
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to sell?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                List your item in minutes and connect with local buyers instantly.
              </p>
              <Link to="/create">
                <Button
                  size="lg"
                  className="bg-card text-primary hover:bg-card/90 font-semibold px-8"
                >
                  {t('createListing')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
