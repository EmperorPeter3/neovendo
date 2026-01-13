import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Listing, Category } from '@/types/listing';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';

interface ListingCardProps {
  listing: Listing;
}

const categoryColors: Record<Category, string> = {
  transport: 'bg-blue-100 text-blue-700',
  realEstate: 'bg-rose-100 text-rose-700',
  jobs: 'bg-purple-100 text-purple-700',
  services: 'bg-emerald-100 text-emerald-700',
  personalItems: 'bg-amber-100 text-amber-700',
  homeAndGarden: 'bg-green-100 text-green-700',
  autoParts: 'bg-slate-100 text-slate-700',
  electronics: 'bg-indigo-100 text-indigo-700',
  hobbies: 'bg-pink-100 text-pink-700',
  animals: 'bg-yellow-100 text-yellow-700',
  business: 'bg-cyan-100 text-cyan-700',
};

export const ListingCard = ({ listing }: ListingCardProps) => {
  const { t } = useLanguage();

  const categoryKey = listing.category as keyof typeof categoryColors;

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <img
          src={listing.images[0] || '/placeholder.svg'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[categoryKey]}`}>
          {t(listing.category)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        <p className="text-xl font-bold text-primary mb-3">
          €{listing.price.toLocaleString()}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{listing.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDistanceToNow(listing.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
