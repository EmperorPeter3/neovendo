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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
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

interface LocationValue {
  lat: number;
  lng: number;
  address: string;
  radius: number;
}

interface LocationSelectorProps {
  value?: LocationValue | null;
  onChange?: (value: LocationValue | null) => void;
  className?: string;
}

const RADIUS_OPTIONS = [1, 2, 3, 5, 10, 25, 50, 100];

// Dynamic circle that follows map center
const DynamicCircle = ({ 
  lat, 
  lng, 
  radius 
}: { 
  lat: number; 
  lng: number; 
  radius: number;
}) => {
  const map = useMap();
  const [center, setCenter] = useState<[number, number]>([lat, lng]);

  useEffect(() => {
    const handleMove = () => {
      const newCenter = map.getCenter();
      setCenter([newCenter.lat, newCenter.lng]);
    };

    map.on('move', handleMove);
    return () => {
      map.off('move', handleMove);
    };
  }, [map]);

  // Update center when lat/lng props change (e.g., new search)
  useEffect(() => {
    setCenter([lat, lng]);
  }, [lat, lng]);

  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{
        color: 'hsl(160, 84%, 39%)',
        fillColor: 'hsl(160, 84%, 39%)',
        fillOpacity: 0.15,
        weight: 2,
      }}
    />
  );
};

// Component to handle map center updates
const MapCenterHandler = ({ 
  center, 
  onCenterChange 
}: { 
  center: [number, number]; 
  onCenterChange: (lat: number, lng: number) => void;
}) => {
  const map = useMap();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      map.setView(center, map.getZoom());
    }
  }, [map, center]);

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

// Component to update map view when center changes from search
const MapViewUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 14);
  }, [map, center]);
  
  return null;
};

export const LocationSelector = ({ value, onChange, className }: LocationSelectorProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [radius, setRadius] = useState(5);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [shouldUpdateView, setShouldUpdateView] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with existing value
  useEffect(() => {
    if (value && open) {
      setSelectedLocation({
        lat: value.lat,
        lng: value.lng,
        address: value.address,
      });
      setMapCenter([value.lat, value.lng]);
      setRadius(value.radius);
      setSearchQuery(value.address);
    }
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
            'Accept-Language': 'ru,en',
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
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setSelectedLocation({
      lat,
      lng,
      address: result.display_name,
    });
    setMapCenter([lat, lng]);
    setShouldUpdateView(true);
    setSearchQuery(result.display_name);
    setSuggestions([]);
  };

  const handleMapCenterChange = useCallback((lat: number, lng: number) => {
    if (selectedLocation) {
      setSelectedLocation(prev => prev ? { ...prev, lat, lng } : null);
    }
    setShouldUpdateView(false);
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
        
        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'ru,en',
              },
            }
          );
          const data = await response.json();
          
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            address: data.display_name || `${latitude}, ${longitude}`,
          });
          setMapCenter([latitude, longitude]);
          setShouldUpdateView(true);
          setSearchQuery(data.display_name || `${latitude}, ${longitude}`);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
          setMapCenter([latitude, longitude]);
          setShouldUpdateView(true);
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
        radius,
      });
    }
    setOpen(false);
  };

  const handleClear = () => {
    onChange?.(null);
    setSelectedLocation(null);
    setMapCenter(null);
    setSearchQuery('');
    setSuggestions([]);
    setRadius(5);
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setMapCenter(null);
    setSearchQuery('');
    setSuggestions([]);
    setRadius(5);
  };

  const displayValue = value?.address 
    ? value.address.split(',').slice(0, 2).join(', ') 
    : t('allRegions');

  const formatSuggestion = (result: NominatimResult) => {
    const parts = result.display_name.split(', ');
    const mainPart = parts.slice(0, 2).join(', ');
    const secondaryPart = parts.slice(2, 4).join(', ');
    return { main: mainPart, secondary: secondaryPart };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[140px] ${className || ''}`}
        >
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate max-w-[120px]">{displayValue}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('selectRegion')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('searchPlaceholder') || 'Введите адрес...'}
                  className="pr-10"
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
                size="icon"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                title="Определить местоположение"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 && !selectedLocation && (
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
          {selectedLocation && mapCenter && (
            <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-border relative">
              {/* Center marker indicator (fixed in center) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-primary -mb-1" fill="currentColor" />
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                </div>
              </div>
              
              <MapContainer
                center={mapCenter}
                zoom={14}
                className="h-full w-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DynamicCircle
                  lat={selectedLocation.lat}
                  lng={selectedLocation.lng}
                  radius={radius * 1000}
                />
                <MapCenterHandler 
                  center={mapCenter} 
                  onCenterChange={handleMapCenterChange} 
                />
                {shouldUpdateView && <MapViewUpdater center={mapCenter} />}
              </MapContainer>
            </div>
          )}

          {/* Radius Selector */}
          {selectedLocation && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t('searchRadius') || 'Радиус поиска'}:
              </span>
              <Select
                value={radius.toString()}
                onValueChange={(val) => setRadius(parseInt(val))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RADIUS_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r.toString()}>
                      {r} км
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {selectedLocation ? (
              <>
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  {t('reset')}
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  {t('apply')}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleClear} className="w-full">
                {t('allRegions')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
