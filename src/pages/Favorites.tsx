import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFavoriteListings } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MapPin } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';
import { FavoriteButton } from '@/components/FavoriteButton';

const categoryIcons: Record<string, string> = {
  electronics: '📱',
  furniture: '🛋️',
  jobs: '💼',
  services: '🔧',
  realEstate: '🏠',
};

const Favorites = () => {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const { data: listings, isLoading } = useFavoriteListings();

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('login')} required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your favorites
            </p>
            <Link to="/login">
              <Button className="gradient-hero text-primary-foreground">
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Favorites
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !listings?.length ? (
          <div className="text-center py-12 bg-card rounded-2xl">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse listings and save your favorites!
            </p>
            <Link to="/search">
              <Button className="gradient-hero text-primary-foreground">
                Browse listings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(listing => (
              <Link 
                key={listing.id} 
                to={`/listing/${listing.id}`}
                className="group"
              >
                <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-card transition-shadow">
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
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
                    <div className="absolute top-2 right-2">
                      <FavoriteButton listingId={listing.id} />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-foreground truncate mb-1">
                      {listing.title}
                    </h3>
                    <p className="text-lg font-bold text-primary mb-2">
                      €{Number(listing.price).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{listing.city}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {categoryIcons[listing.category]} {t(listing.category as TranslationKey)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
