import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export const FavoriteButton = ({ listingId, variant = 'icon', className }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: favorites = [] } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const isFavorite = favorites.includes(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    toggleFavorite.mutate({ listingId, isFavorite });
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={toggleFavorite.isPending}
        className={cn('gap-2', className)}
      >
        {toggleFavorite.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-red-500 text-red-500')} />
        )}
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
      className={cn(
        'p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground',
        isFavorite && 'text-red-500 hover:text-red-600',
        className
      )}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {toggleFavorite.isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart className={cn('w-5 h-5', isFavorite && 'fill-red-500')} />
      )}
    </button>
  );
};
