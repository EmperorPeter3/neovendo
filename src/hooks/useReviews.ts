import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ReviewWithReviewer {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: {
    name: string;
    avatar_url: string | null;
  };
}

// Get reviews for a specific user
export const useUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch reviewer profiles separately
      const reviewerIds = [...new Set(data.map(r => r.reviewer_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name, avatar_url')
        .in('user_id', reviewerIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return data.map(review => ({
        ...review,
        reviewer: profileMap.get(review.reviewer_id),
      })) as ReviewWithReviewer[];
    },
    enabled: !!userId,
  });
};

// Get reviews for a specific listing
export const useListingReviews = (listingId: string) => {
  return useQuery({
    queryKey: ['reviews', 'listing', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch reviewer profiles separately
      const reviewerIds = [...new Set(data.map(r => r.reviewer_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name, avatar_url')
        .in('user_id', reviewerIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return data.map(review => ({
        ...review,
        reviewer: profileMap.get(review.reviewer_id),
      })) as ReviewWithReviewer[];
    },
    enabled: !!listingId,
  });
};

// Check if user can review (has chatted with seller about this listing)
export const useCanReview = (listingId: string, sellerId: string) => {
  return useQuery({
    queryKey: ['canReview', listingId, sellerId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { canReview: false, hasReviewed: false };

      // Check if user has already reviewed this seller for this listing
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('listing_id', listingId)
        .eq('reviewer_id', user.id)
        .eq('reviewed_user_id', sellerId)
        .single();

      if (existingReview) {
        return { canReview: false, hasReviewed: true };
      }

      // Check if user has chatted with seller about this listing
      const { data: chat } = await supabase
        .from('chats')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

      return { canReview: !!chat, hasReviewed: false };
    },
    enabled: !!listingId && !!sellerId,
  });
};

// Create a review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      reviewedUserId,
      rating,
      comment,
    }: {
      listingId: string;
      reviewedUserId: string;
      rating: number;
      comment?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          listing_id: listingId,
          reviewer_id: user.id,
          reviewed_user_id: reviewedUserId,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['canReview', variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
