import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockListings } from '@/data/mockListings';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { TranslationKey } from '@/i18n/translations';

const ListingDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const listing = mockListings.find(l => l.id === id);

  if (!listing) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Listing not found</h1>
          <Link to="/">
            <Button>{t('back')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = listing.images.length > 0 ? listing.images : ['/placeholder.svg'];

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images Section */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
              <img
                src={images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              
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

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">{t('description')}</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
                  {t(listing.category as TranslationKey)}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                {listing.title}
              </h1>

              <p className="text-3xl font-bold text-primary mb-4">
                €{listing.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.city}, {listing.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(listing.createdAt, { addSuffix: true })}</span>
                </div>
              </div>

              <Button className="w-full gradient-hero text-primary-foreground gap-2 h-12 text-base">
                <MessageCircle className="w-5 h-5" />
                {t('contact')}
              </Button>
            </div>

            {/* Seller Card */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">{t('postedBy')}</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xl font-semibold text-secondary-foreground">
                    {listing.ownerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{listing.ownerName}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span>4.8 (23 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetail;
