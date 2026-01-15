import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Calendar, Package } from 'lucide-react';
import { useUserReviews } from '@/hooks/useReviews';
import { ReviewsList } from '@/components/ReviewsList';
import { ReviewForm } from '@/components/ReviewForm';
import { ListingCard } from '@/components/ListingCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch public profile (using view that excludes email for privacy)
  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles_public')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch user's active listings
  const { data: userListings = [] } = useQuery({
    queryKey: ['userListings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  const { data: reviews = [] } = useUserReviews(id || '');

  // Check if current user can review this user
  const { data: canReviewData } = useQuery({
    queryKey: ['canReviewUser', id, user?.id],
    queryFn: async () => {
      if (!user || user.id === id) return { canReview: false, hasReviewed: false };

      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', user.id)
        .eq('reviewed_user_id', id)
        .limit(1);

      if (existingReview && existingReview.length > 0) {
        return { canReview: false, hasReviewed: true };
      }

      const { data: chats } = await supabase
        .from('chats')
        .select('id, listing_id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .or(`buyer_id.eq.${id},seller_id.eq.${id}`)
        .limit(1);

      const hasChat = chats?.some(() => true) || false;
      
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
        <div className="container py-6 md:py-8 max-w-4xl mx-auto">
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

        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          {/* User Info Section */}
          <div className="flex flex-col items-center pb-8 border-b border-border">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>

            <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
              {profile.name}
            </h1>

            {profile.rating_count > 0 && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{Number(profile.rating).toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">
                  ({profile.rating_count})
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {t('profile.memberSince' as any) || 'On the platform since'}{' '}
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* User Listings Section */}
          <div className="py-8 border-b border-border">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-bold text-foreground">
                {t('profile.userListings' as any) || 'Listings'} 
                {userListings.length > 0 && ` (${userListings.length})`}
              </h2>
            </div>

            {userListings.length > 0 ? (
              <div className="max-h-[600px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {userListings.map((listing) => (
                    <Link key={listing.id} to={`/listing/${listing.id}`}>
                      <div className="bg-secondary/30 rounded-xl p-2 hover:bg-secondary/50 transition-colors">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-muted">
                          {listing.images && listing.images.length > 0 ? (
                            <img 
                              src={listing.images[0]} 
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground text-xs truncate">
                          {listing.title}
                        </h3>
                        <p className="text-primary font-semibold text-xs">
                          €{Number(listing.price).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                {t('profile.noListings' as any) || 'No active listings'}
              </p>
            )}
          </div>

          {/* Reviews Section */}
          <div className="pt-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="font-display text-xl font-bold text-foreground">
                {t('profile.reviews' as any) || 'Reviews'} 
                {reviews.length > 0 && ` (${reviews.length})`}
              </h2>
            </div>

            {!isOwnProfile && canReviewData?.canReview && !canReviewData?.hasReviewed && canReviewData.chatListingId && (
              <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
                <h3 className="font-semibold text-foreground mb-3">
                  {t('profile.leaveReview' as any) || 'Leave a review'}
                </h3>
                <ReviewForm 
                  listingId={canReviewData.chatListingId} 
                  sellerId={id || ''}
                />
              </div>
            )}

            {canReviewData?.hasReviewed && (
              <p className="text-sm text-muted-foreground mb-4 bg-secondary/50 rounded-lg p-3 text-center">
                ✓ {t('profile.alreadyReviewed' as any) || 'You have already reviewed this user'}
              </p>
            )}
            
            {reviews.length > 0 ? (
              <ReviewsList 
                reviews={reviews}
                averageRating={profile.rating ? Number(profile.rating) : undefined}
                totalCount={profile.rating_count || undefined}
              />
            ) : (
              <p className="text-muted-foreground text-center py-6">
                {t('profile.noReviews' as any) || 'No reviews yet'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
