import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useListing } from '@/hooks/useListings';
import { useCreateChat } from '@/hooks/useChats';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ShareButton } from '@/components/ShareButton';
import { TransportSpecifications } from '@/components/TransportSpecifications';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { addRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { TranslationKey } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';

const categoryIcons: Record<string, string> = {
  electronics: '📱',
  furniture: '🛋️',
  jobs: '💼',
  services: '🔧',
  realEstate: '🏠',
};

const ListingDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: listing, isLoading, error } = useListing(id || '');
  const createChat = useCreateChat();

  // Track viewed listing
  useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id]);
  

  const handleContact = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!listing?.owner?.user_id) {
      toast({
        title: 'Error',
        description: 'Cannot contact seller',
        variant: 'destructive',
      });
      return;
    }

    // Can't message yourself
    if (listing.owner.user_id === user.id) {
      toast({
        title: 'Info',
        description: 'This is your own listing',
      });
      return;
    }

    try {
      const chat = await createChat.mutateAsync({
        listingId: listing.id,
        sellerId: listing.owner.user_id,
      });
      navigate(`/chat/${chat.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start chat',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6 md:py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-20 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-8" />
                <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-2xl p-6 h-64" />
                <div className="bg-card rounded-2xl p-6 h-32" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Listing not found</h1>
          <Button onClick={() => navigate(-1)}>{t('back')}</Button>
        </div>
      </Layout>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const hasImages = images.length > 0;

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images Section */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
              {hasImages ? (
                <img
                  src={images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-secondary/50">
                  {categoryIcons[listing.category]}
                </div>
              )}
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-card/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{t('description')}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description || 'No description provided.'}
              </p>
            </div>

            {/* Transport Specifications */}
            <TransportSpecifications listing={listing} />

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
                  {categoryIcons[listing.category]} {t(listing.category as TranslationKey)}
                </span>
                <div className="flex gap-2">
                  <FavoriteButton listingId={listing.id} />
                  <ShareButton title={listing.title} />
                </div>
              </div>

              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                {listing.title}
              </h1>

              <p className="text-3xl font-bold text-primary mb-4">
                €{Number(listing.price).toLocaleString()}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.city}, {listing.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {listing.owner?.user_id !== user?.id && (
                <Button 
                  onClick={handleContact}
                  className="w-full gradient-hero text-primary-foreground gap-2 h-12 text-base"
                  disabled={createChat.isPending}
                >
                  {createChat.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  {t('contact')}
                </Button>
              )}
            </div>

            {/* Seller Card */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">{t('postedBy')}</h3>
              
              <Link 
                to={`/user/${listing.owner?.user_id}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={listing.owner?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(listing.owner?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground hover:text-primary transition-colors">
                    {listing.owner?.name || 'Unknown'}
                  </p>
                  {listing.owner?.rating !== undefined && Number(listing.owner.rating) > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{Number(listing.owner.rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetail;
