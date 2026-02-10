import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMyListings, useDeleteListing } from '@/hooks/useListings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types/listing';

const categoryIcons: Record<Category, string> = {
  transport: '🚗',
  realEstate: '🏠',
  jobs: '💼',
  services: '🔧',
  personalItems: '👕',
  homeAndGarden: '🏡',
  autoParts: '🔩',
  electronics: '📱',
  hobbies: '🎨',
  animals: '🐕',
  business: '🏢',
};

const MyListings = () => {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const { data: listings, isLoading } = useMyListings();
  const deleteListing = useDeleteListing();
  const { toast } = useToast();

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('login')} required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your listings
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await deleteListing.mutateAsync(id);
      toast({
        title: t('success'),
        description: 'Listing deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete listing',
        variant: 'destructive',
      });
    }
  };

  const activeListings = listings?.filter(l => l.status === 'active') || [];
  const deletedListings = listings?.filter(l => l.status === 'deleted') || [];

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            My Listings
          </h1>
          <Link to="/create">
            <Button className="gap-2 gradient-hero text-primary-foreground">
              <Plus className="w-4 h-4" />
              New Listing
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !activeListings.length && !deletedListings.length ? (
          <div className="text-center py-12 bg-card rounded-2xl">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No listings yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your first listing and start selling!
            </p>
            <Link to="/create">
              <Button className="gradient-hero text-primary-foreground">
                Create Listing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Listings */}
            {activeListings.length > 0 && (
              <div>
                <h2 className="font-medium text-foreground mb-3">
                  Active ({activeListings.length})
                </h2>
                <div className="space-y-3">
                  {activeListings.map(listing => (
                    <div key={listing.id} className="bg-card rounded-xl p-4 shadow-sm hover:shadow-card transition-shadow">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {listing.images?.[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              {categoryIcons[listing.category as Category] || '📦'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {listing.title}
                          </h3>
                          <p className="text-primary font-semibold">
                            €{Number(listing.price).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {categoryIcons[listing.category as Category] || '📦'} {t(listing.category as TranslationKey)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {listing.city}, {listing.country}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link to={`/listing/${listing.id}`}>
                            <Button variant="outline" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/edit-listing/${listing.id}`}>
                            <Button variant="outline" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(listing.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deleted Listings */}
            {deletedListings.length > 0 && (
              <div>
                <h2 className="font-medium text-muted-foreground mb-3">
                  Deleted ({deletedListings.length})
                </h2>
                <div className="space-y-3 opacity-60">
                  {deletedListings.map(listing => (
                    <div key={listing.id} className="bg-card rounded-xl p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {listing.images?.[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover grayscale"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              {categoryIcons[listing.category as Category] || '📦'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-muted-foreground truncate">
                            {listing.title}
                          </h3>
                          <p className="text-muted-foreground">
                            €{Number(listing.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyListings;
