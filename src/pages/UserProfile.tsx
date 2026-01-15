import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
import { useUserReviews } from '@/hooks/useReviews';
import { ReviewsList } from '@/components/ReviewsList';
import { ReviewForm } from '@/components/ReviewForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch public profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: reviews = [] } = useUserReviews(id || '');

  // Check if current user can review this user (has had any chat with them)
  const { data: canReviewData } = useQuery({
    queryKey: ['canReviewUser', id, user?.id],
    queryFn: async () => {
      if (!user || user.id === id) return { canReview: false, hasReviewed: false };

      // Check if user has already reviewed this user
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', user.id)
        .eq('reviewed_user_id', id)
        .limit(1);

      if (existingReview && existingReview.length > 0) {
        return { canReview: false, hasReviewed: true };
      }

      // Check if user has chatted with this user
      const { data: chats } = await supabase
        .from('chats')
        .select('id, listing_id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .or(`buyer_id.eq.${id},seller_id.eq.${id}`)
        .limit(1);

      // Filter chats where both users are participants
      const hasChat = chats?.some(chat => true) || false;
      
      return { canReview: hasChat, hasReviewed: false, chatListingId: chats?.[0]?.listing_id };
    },
    enabled: !!id && !!user,
  });

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6 md:py-8 max-w-2xl">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-20 mb-6" />
            <div className="bg-card rounded-2xl p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-muted mb-4" />
                <div className="h-6 bg-muted rounded w-32 mb-2" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('userNotFound' as any) || 'User not found'}
          </h1>
          <Button onClick={() => navigate(-1)}>{t('back')}</Button>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 sticky top-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>

                <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
                  {profile.name}
                </h1>

                {/* Rating */}
                {profile.rating_count > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{Number(profile.rating).toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">
                      ({profile.rating_count})
                    </span>
                  </div>
                )}

                {/* Member since */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('memberSince' as any) || 'Member since'}{' '}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
              {/* Review Form */}
              {!isOwnProfile && canReviewData?.canReview && !canReviewData?.hasReviewed && canReviewData.chatListingId && (
                <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-3">
                    {t('leaveReview' as any) || 'Leave a review'}
                  </h3>
                  <ReviewForm 
                    listingId={canReviewData.chatListingId} 
                    sellerId={id || ''}
                  />
                </div>
              )}

              {canReviewData?.hasReviewed && (
                <p className="text-sm text-muted-foreground mb-4 bg-secondary/50 rounded-lg p-3 text-center">
                  ✓ {t('alreadyReviewed' as any) || 'You have already reviewed this user'}
                </p>
              )}

              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {t('reviews' as any) || 'Reviews'} {reviews.length > 0 && `(${reviews.length})`}
              </h2>
              
              {reviews.length > 0 ? (
                <ReviewsList 
                  reviews={reviews}
                  averageRating={profile.rating ? Number(profile.rating) : undefined}
                  totalCount={profile.rating_count || undefined}
                />
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t('noReviews' as any) || 'No reviews yet'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
