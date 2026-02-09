import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, X, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
    road?: string;
    house_number?: string;
  };
}

export interface LocationPickerValue {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  country?: string;
}

interface LocationPickerProps {
  value?: LocationPickerValue | null;
  onChange?: (value: LocationPickerValue | null) => void;
  className?: string;
  error?: boolean;
}

// Component that handles map events - must be inside MapContainer
const MapEventHandler = ({ 
  onCenterChange,
  flyToLocation
}: { 
  onCenterChange: (lat: number, lng: number) => void;
  flyToLocation: { lat: number; lng: number } | null;
}) => {
  const map = useMap();

  // Fly to new location when it changes from search
  useEffect(() => {
    if (flyToLocation) {
      map.flyTo([flyToLocation.lat, flyToLocation.lng], 16, { duration: 0.5 });
    }
  }, [map, flyToLocation]);

  // Handle map movement
  useEffect(() => {
    const handleMoveEnd = () => {
      const newCenter = map.getCenter();
      onCenterChange(newCenter.lat, newCenter.lng);
    };

    map.on('moveend', handleMoveEnd);
    
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onCenterChange]);

  return null;
};

export const LocationPicker = ({ value, onChange, className, error }: LocationPickerProps) => {
  const { t, language } = useLanguage();
  const nominatimLang = language === 'ru' ? 'ru,en' : `${language},en`;
  const [open, setOpen] = useState(false);
  const [mapSessionKey, setMapSessionKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    city?: string;
    country?: string;
  } | null>(null);
  const [initialCenter, setInitialCenter] = useState<[number, number] | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<{ lat: number; lng: number } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track external value changes
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (value && value !== prevValueRef.current && open) {
      setSelectedLocation({
        lat: value.lat,
        lng: value.lng,
        address: value.address,
        city: value.city,
        country: value.country,
      });
      setInitialCenter([value.lat, value.lng]);
      setSearchQuery(value.address);
      setMapSessionKey((k) => k + 1);
    }
    prevValueRef.current = value;
  }, [value, open]);

  // Debounced search
  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=8`,
        {
          headers: {
            'Accept-Language': nominatimLang,
          },
        }
      );
      const data: NominatimResult[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [nominatimLang]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const extractCityCountry = (result: NominatimResult) => {
    const address = result.address;
    const city = address?.city || address?.town || address?.village || address?.municipality || '';
    const country = address?.country || '';
    return { city, country };
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const { city, country } = extractCityCountry(result);
    
    const isFirstSelection = !selectedLocation;
    
    setSelectedLocation({
      lat,
      lng,
      address: result.display_name,
      city,
      country,
    });
    
    if (isFirstSelection) {
      setInitialCenter([lat, lng]);
    } else {
      setFlyToLocation({ lat, lng });
    }
    
    setSearchQuery(result.display_name);
    setSuggestions([]);
  };

  const handleMapCenterChange = useCallback(async (lat: number, lng: number) => {
    if (selectedLocation) {
      setSelectedLocation(prev => prev ? { ...prev, lat, lng } : null);
      
      // Reverse geocode to get address for new position
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              'Accept-Language': nominatimLang,
            },
          }
        );
        const data = await response.json();
        const newAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || '';
        const country = data.address?.country || '';
        
        setSelectedLocation(prev => prev ? { ...prev, address: newAddress, city, country } : null);
        setSearchQuery(newAddress);
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setSelectedLocation(prev => prev ? { ...prev, address: fallbackAddress } : null);
        setSearchQuery(fallbackAddress);
      }
    }
  }, [selectedLocation]);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': nominatimLang,
              },
            }
          );
          const data = await response.json();
          const isFirstSelection = !selectedLocation;
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || '';
          const country = data.address?.country || '';
          
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            address: data.display_name || `${latitude}, ${longitude}`,
            city,
            country,
          });
          
          if (isFirstSelection) {
            setInitialCenter([latitude, longitude]);
          } else {
            setFlyToLocation({ lat: latitude, lng: longitude });
          }
          
          setSearchQuery(data.display_name || `${latitude}, ${longitude}`);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          const isFirstSelection = !selectedLocation;
          
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
          
          if (isFirstSelection) {
            setInitialCenter([latitude, longitude]);
          } else {
            setFlyToLocation({ lat: latitude, lng: longitude });
          }
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleApply = () => {
    if (selectedLocation) {
      onChange?.({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address,
        city: selectedLocation.city,
        country: selectedLocation.country,
      });
    }
    setOpen(false);
  };

  const handleClear = () => {
    onChange?.(null);
    setSelectedLocation(null);
    setInitialCenter(null);
    setFlyToLocation(null);
    setSearchQuery('');
    setSuggestions([]);
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setInitialCenter(null);
    setFlyToLocation(null);
    setSearchQuery('');
    setSuggestions([]);
  };

  const displayValue = value?.address 
    ? value.address.split(',').slice(0, 2).join(', ') 
    : t('location');

  const formatSuggestion = (result: NominatimResult) => {
    const parts = result.display_name.split(', ');
    const mainPart = parts.slice(0, 2).join(', ');
    const secondaryPart = parts.slice(2, 4).join(', ');
    return { main: mainPart, secondary: secondaryPart };
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (value) {
        setSelectedLocation({
          lat: value.lat,
          lng: value.lng,
          address: value.address,
          city: value.city,
          country: value.country,
        });
        setInitialCenter([value.lat, value.lng]);
        setSearchQuery(value.address);
      } else {
        setSelectedLocation(null);
        setInitialCenter(null);
        setSearchQuery('');
      }
      setFlyToLocation(null);
      setSuggestions([]);
      setIsSearching(false);
      setMapSessionKey((k) => k + 1);
    }
    
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 px-4 gap-2 rounded-xl border-2 bg-card hover:bg-secondary justify-start text-left ${error ? 'border-destructive ring-destructive' : 'border-border'} ${className || ''}`}
        >
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{displayValue}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] h-[100dvh] max-w-none sm:w-[80vw] sm:h-[70vh] sm:max-h-[70vh] overflow-hidden flex flex-col rounded-none sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('location')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 px-1 pt-1">
          {/* Search Input */}
          <div className="relative z-[100]">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'Введите адрес...'}
                  className="pr-10 focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="gap-2 shrink-0"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{t('currentLocation')}</span>
              </Button>
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
                <ScrollArea className="max-h-[200px]">
                  {suggestions.map((result) => {
                    const formatted = formatSuggestion(result);
                    return (
                      <button
                        key={result.place_id}
                        onClick={() => handleSelectSuggestion(result)}
                        className="w-full text-left p-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                      >
                        <div className="font-medium">{formatted.main}</div>
                        <div className="text-sm text-muted-foreground">{formatted.secondary}</div>
                      </button>
                    );
                  })}
                </ScrollArea>
              </div>
            )}

            {isSearching && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Map */}
          {selectedLocation && initialCenter && (
            <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-border relative z-0">
              {/* Center marker indicator (fixed in center) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-primary -mb-1" fill="currentColor" />
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                </div>
              </div>
              
              <MapContainer
                key={mapSessionKey}
                center={initialCenter}
                zoom={16}
                className="h-full w-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventHandler 
                  onCenterChange={handleMapCenterChange}
                  flyToLocation={flyToLocation}
                />
              </MapContainer>
            </div>
          )}

          {/* Empty state - no location selected */}
          {!selectedLocation && (
            <div className="flex-1 min-h-[300px] rounded-lg border border-dashed border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('enterAddress')}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pb-2">
            {value && (
              <Button
                variant="outline"
                onClick={handleClear}
                className="flex-1"
              >
                {t('reset')}
              </Button>
            )}
            {selectedLocation && !value && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                {t('reset')}
              </Button>
            )}
            <Button
              onClick={handleApply}
              disabled={!selectedLocation}
              className="flex-1 gradient-hero text-primary-foreground"
            >
              {t('apply')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
