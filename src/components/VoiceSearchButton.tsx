import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VoiceSearchResult {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface VoiceSearchButtonProps {
  className?: string;
  onResult?: (result: VoiceSearchResult) => void;
}

export const VoiceSearchButton = ({ className, onResult }: VoiceSearchButtonProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const langMap: Record<string, string> = {
    en: 'en-US', ru: 'ru-RU', pt: 'pt-PT', es: 'es-ES',
    de: 'de-DE', fr: 'fr-FR', it: 'it-IT',
  };

  const processTranscript = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-voice-search', {
        body: { transcript, language },
      });

      if (error) throw error;

      const result = data as VoiceSearchResult;
      
      if (onResult) {
        onResult(result);
        return;
      }

      // Navigate to search with extracted params
      const params = new URLSearchParams();
      if (result.query) params.set('q', result.query);
      if (result.category) params.set('category', result.category);
      if (result.subcategory) params.set('subcategory', result.subcategory);
      if (result.minPrice) params.set('minPrice', result.minPrice.toString());
      if (result.maxPrice) params.set('maxPrice', result.maxPrice.toString());
      navigate(`/search?${params.toString()}`);
    } catch (e) {
      console.error('Voice search error:', e);
      toast.error(t('voiceSearchError' as any));
    } finally {
      setIsProcessing(false);
    }
  }, [language, navigate, onResult, t]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(t('voiceNotSupported' as any));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[language] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      toast.info(`"${transcript}"`);
      processTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error(t('microphonePermissionDenied' as any));
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [language, processTranscript, t]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        'h-12 w-12 rounded-xl shrink-0 transition-all',
        isListening && 'bg-destructive/10 text-destructive animate-pulse',
        className,
      )}
      title={isListening ? 'Stop' : (t('voiceSearch' as any) || 'Voice search')}
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};
