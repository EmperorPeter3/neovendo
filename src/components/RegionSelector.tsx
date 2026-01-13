import { useState } from 'react';
import { MapPin, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';

interface Region {
  country: string;
  cities: string[];
}

const regions: Region[] = [
  {
    country: 'Germany',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig'],
  },
  {
    country: 'France',
    cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux'],
  },
  {
    country: 'Spain',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Bilbao'],
  },
  {
    country: 'Italy',
    cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Bologna', 'Venice'],
  },
  {
    country: 'Netherlands',
    cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  },
  {
    country: 'Poland',
    cities: ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk'],
  },
  {
    country: 'Portugal',
    cities: ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Faro'],
  },
  {
    country: 'Austria',
    cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
  },
];

interface RegionSelectorProps {
  value?: { country?: string; city?: string };
  onChange?: (value: { country?: string; city?: string }) => void;
}

export const RegionSelector = ({ value, onChange }: RegionSelectorProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [view, setView] = useState<'countries' | 'cities'>('countries');

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setView('cities');
  };

  const handleCitySelect = (city: string) => {
    onChange?.({ country: selectedCountry || undefined, city });
    setOpen(false);
    setView('countries');
    setSelectedCountry(null);
  };

  const handleSelectAllCountry = () => {
    onChange?.({ country: selectedCountry || undefined, city: undefined });
    setOpen(false);
    setView('countries');
    setSelectedCountry(null);
  };

  const handleBack = () => {
    setView('countries');
    setSelectedCountry(null);
  };

  const handleClear = () => {
    onChange?.({ country: undefined, city: undefined });
    setOpen(false);
  };

  const displayValue = value?.city 
    ? `${value.city}, ${value.country}` 
    : value?.country 
      ? value.country 
      : t('allRegions');

  const currentRegion = regions.find(r => r.country === selectedCountry);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[140px]"
        >
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate max-w-[120px]">{displayValue}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {view === 'cities' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={handleBack}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {view === 'countries' ? t('selectRegion') : selectedCountry}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {view === 'countries' ? (
            <div className="space-y-1">
              <button
                onClick={handleClear}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <span className="font-medium">{t('allRegions')}</span>
                {!value?.country && !value?.city && (
                  <span className="text-primary text-sm">✓</span>
                )}
              </button>
              {regions.map((region) => (
                <button
                  key={region.country}
                  onClick={() => handleCountrySelect(region.country)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <span className="font-medium">{region.country}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={handleSelectAllCountry}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <span className="font-medium">All {selectedCountry}</span>
                {value?.country === selectedCountry && !value?.city && (
                  <span className="text-primary text-sm">✓</span>
                )}
              </button>
              {currentRegion?.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <span>{city}</span>
                  {value?.city === city && value?.country === selectedCountry && (
                    <span className="text-primary text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
