import { useState, useEffect, useMemo } from 'react';
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

  // Stable key: sorted IDs + language
  const stableKey = useMemo(() => {
    if (!listings || listings.length === 0) return '';
    return listings.map(l => l.id).sort().join(',') + '::' + language;
  }, [listings, language]);

  // Memoize listings snapshot to avoid re-fetching on reference changes
  const listingsSnapshot = useMemo(() => {
    if (!listings || listings.length === 0) return null;
    return listings.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description || '',
      city: l.city,
      country: l.country,
    }));
  }, [stableKey]); // only recompute when stableKey changes

  useEffect(() => {
    if (!listingsSnapshot || language === 'en') {
      setTranslations({});
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    supabase.functions.invoke('translate-listing', {
      body: { listings: listingsSnapshot, targetLanguage: language },
    }).then(({ data, error }) => {
      if (cancelled || error || !data?.translations) return;
      setTranslations(data.translations);
    }).catch(() => {
      // silently fail
    }).finally(() => {
      if (!cancelled) setIsTranslating(false);
    });

    return () => { cancelled = true; };
  }, [stableKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTranslated = (listing: ListingInput) => {
    if (language === 'en') {
      return {
        title: listing.title,
        description: listing.description || '',
        city: listing.city,
        country: listing.country,
      };
    }
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
