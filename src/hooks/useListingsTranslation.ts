import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatedListing {
  id: string;
  title: string;
  description: string;
  city: string;
  country: string;
}

interface ListingInput {
  id: string;
  title: string;
  description?: string | null;
  city: string;
  country: string;
}

export const useListingsTranslation = (listings: ListingInput[] | undefined) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, TranslatedListing>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setTranslations({});
    if (!listings || listings.length === 0 || language === 'en') return;

    let cancelled = false;
    setIsTranslating(true);

    // Build a stable key from listing ids to avoid re-fetching same set
    const items = listings.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description || '',
      city: l.city,
      country: l.country,
    }));

    supabase.functions.invoke('translate-listing', {
      body: { listings: items, targetLanguage: language },
    }).then(({ data, error }) => {
      if (cancelled || error || !data?.translations) return;
      setTranslations(data.translations);
    }).catch(() => {
      // silently fail
    }).finally(() => {
      if (!cancelled) setIsTranslating(false);
    });

    return () => { cancelled = true; };
  }, [listings, language]);

  const getTranslated = (listing: ListingInput) => {
    const t = translations[listing.id];
    return t ? {
      title: t.title || listing.title,
      description: t.description || listing.description || '',
      city: t.city || listing.city,
      country: t.country || listing.country,
    } : {
      title: listing.title,
      description: listing.description || '',
      city: listing.city,
      country: listing.country,
    };
  };

  return { translations, getTranslated, isTranslating };
};
