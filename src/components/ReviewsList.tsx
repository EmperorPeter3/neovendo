import { ReviewCard } from './ReviewCard';
import { ReviewWithReviewer } from '@/hooks/useReviews';
import { Star } from 'lucide-react';

interface ReviewsListProps {
  reviews: ReviewWithReviewer[];
  averageRating?: number;
  totalCount?: number;
  showHeader?: boolean;
}

export const ReviewsList = ({ 
  reviews, 
  averageRating, 
  totalCount,
  showHeader = true 
}: ReviewsListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet
      </div>
    );
  }

  return (
    <div>
      {showHeader && averageRating !== undefined && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">
            Based on {totalCount || reviews.length} review{(totalCount || reviews.length) !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};
