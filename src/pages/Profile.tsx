import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { t } = useLanguage();
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(profile?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('login')} required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your profile
            </p>
            <Link to="/login">
              <Button className="gradient-hero text-primary-foreground">
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();

      toast({
        title: t('success'),
        description: 'Avatar updated successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: t('success'),
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            Profile
          </h1>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
              
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                {isUploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>

            {/* Rating */}
            {profile && profile.rating_count > 0 && (
              <div className="flex items-center gap-1 mt-3">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{Number(profile.rating).toFixed(1)}</span>
                <span className="text-muted-foreground">({profile.rating_count} reviews)</span>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('email')}
              </label>
              <Input
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <Button
              onClick={handleUpdateProfile}
              className="w-full gradient-hero text-primary-foreground"
              disabled={isUpdating || name === profile?.name}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>

          {/* Member Since */}
          {profile && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
