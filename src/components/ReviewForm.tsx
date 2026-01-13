import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { useCreateReview } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReviewFormProps {
  listingId: string;
  sellerId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ listingId, sellerId, onSuccess }: ReviewFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createReview.mutateAsync({
        listingId,
        reviewedUserId: sellerId,
        rating,
        comment: comment.trim() || undefined,
      });

      toast({
        title: t('success'),
        description: 'Review submitted successfully!',
      });

      setRating(0);
      setComment('');
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-secondary/50 rounded-xl p-4">
      <h4 className="font-medium text-foreground mb-3">Leave a Review</h4>
      
      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted text-muted-foreground'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
        </span>
      </div>

      {/* Comment */}
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        className="mb-4 resize-none"
        rows={3}
      />

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || createReview.isPending}
        className="w-full gradient-hero text-primary-foreground"
      >
        {createReview.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </div>
  );
};
