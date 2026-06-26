import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Shared across every hook instance so concurrent lists (e.g. the homepage
// renders two) show a single toast that only dismisses once all are done.
const TRANSLATING_TOAST_ID = 'translating-listings';
let pendingTranslations = 0;

const showTranslatingToast = (message: string) => {
  pendingTranslations += 1;
  toast.loading(message, {
    id: TRANSLATING_TOAST_ID,
    position: 'top-center',
    duration: Infinity,
    // Bright, high-contrast styling so the user clearly notices it.
    className: 'font-semibold',
    style: {
      background: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '1px solid hsl(var(--primary))',
      fontSize: '0.95rem',
      padding: '14px 18px',
      boxShadow: '0 12px 32px -6px hsl(var(--primary) / 0.6)',
    },
  });
};

const hideTranslatingToast = () => {
  pendingTranslations = Math.max(0, pendingTranslations - 1);
  if (pendingTranslations === 0) {
    toast.dismiss(TRANSLATING_TOAST_ID);
  }
};

// Force the toast away (e.g. when switching to English): no translation runs,
// so no message should linger from a previous in-flight request.
const clearTranslatingToast = () => {
  pendingTranslations = 0;
  toast.dismiss(TRANSLATING_TOAST_ID);
};

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
  const { language, t } = useLanguage();
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
    // Listing content is authored in Russian, so 'ru' is the source language
    // and needs no translation. Every other language (incl. English) does.
    if (!listingsSnapshot || language === 'ru') {
      setTranslations({});
      clearTranslatingToast();
      return;
    }

    let cancelled = false;
    setIsTranslating(true);
    showTranslatingToast(t('translatingListings'));

    supabase.functions.invoke('translate-listing', {
      body: { listings: listingsSnapshot, targetLanguage: language },
    }).then(({ data, error }) => {
      if (cancelled || error || !data?.translations) return;
      setTranslations(data.translations);
    }).catch(() => {
      // silently fail
    }).finally(() => {
      hideTranslatingToast();
      if (!cancelled) setIsTranslating(false);
    });

    return () => { cancelled = true; };
  }, [stableKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTranslated = (listing: ListingInput) => {
    if (language === 'ru') {
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
