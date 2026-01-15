import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
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
import { Button } from '@/components/ui/button';

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

interface ListingCardLargeProps {
  listing: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    price: number;
    city: string;
    country: string;
    images: string[] | null;
    created_at: string;
    owner?: {
      name: string;
      avatar_url: string | null;
    } | null;
  };
}

export const ListingCardLarge = ({ listing }: ListingCardLargeProps) => {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = listing.images || [];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const Icon = categoryIcons[listing.category as Category] || categoryIcons[''];

  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col md:flex-row">
        {/* Image Gallery */}
        <div className="relative w-full md:w-80 lg:w-96 shrink-0 aspect-[4/3] md:aspect-auto md:h-64 overflow-hidden bg-muted">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Navigation arrows */}
              {hasMultipleImages && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card/90 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card/90 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Dot indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleDotClick(e, index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-primary w-4'
                          : 'bg-card/60 hover:bg-card/80'
                      }`}
                    />
                  ))}
                  {images.length > 5 && (
                    <span className="text-xs text-card/80 ml-1">+{images.length - 5}</span>
                  )}
                </div>
              )}
              
              {/* Image counter */}
              {hasMultipleImages && (
                <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50">
              <Icon className="w-16 h-16 text-primary/60" />
            </div>
          )}
          
          {/* Category badge */}
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-card/90 backdrop-blur-sm text-foreground">
            {t(listing.category as TranslationKey)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>
            
            {listing.description && (
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {listing.description}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between mt-auto pt-3 border-t border-border">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                €{Number(listing.price).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{listing.city}, {listing.country}</span>
              </div>
            </div>
            
            {listing.owner && (
              <div className="flex items-center gap-2">
                {listing.owner.avatar_url ? (
                  <img
                    src={listing.owner.avatar_url}
                    alt={listing.owner.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {listing.owner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground hidden lg:block">
                  {listing.owner.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ListingCardLargeSkeleton = () => (
  <div className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse flex flex-col md:flex-row">
    <div className="w-full md:w-80 lg:w-96 shrink-0 aspect-[4/3] md:aspect-auto md:h-64 bg-muted" />
    <div className="flex-1 p-5">
      <div className="h-6 bg-muted rounded w-3/4 mb-3" />
      <div className="h-4 bg-muted rounded w-full mb-2" />
      <div className="h-4 bg-muted rounded w-2/3 mb-6" />
      <div className="border-t border-border pt-3 flex justify-between">
        <div>
          <div className="h-7 bg-muted rounded w-24 mb-2" />
          <div className="h-4 bg-muted rounded w-32" />
        </div>
        <div className="h-8 w-8 bg-muted rounded-full" />
      </div>
    </div>
  </div>
);
