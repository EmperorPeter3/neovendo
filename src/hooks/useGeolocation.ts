import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export const useGeolocation = (requestOnMount = false) => {
  const [state, setState] = useState<GeolocationState>(() => {
    // Try to restore from sessionStorage for instant load
    const cached = sessionStorage.getItem('user_geolocation');
    if (cached) {
      const { lat, lng } = JSON.parse(cached);
      return { lat, lng, loading: false, error: null, permissionDenied: false };
    }
    return { lat: null, lng: null, loading: requestOnMount, error: null, permissionDenied: false };
  });

  useEffect(() => {
    if (!requestOnMount) return;
    if (state.lat !== null && state.lng !== null) return; // already have coords
    if (!navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        sessionStorage.setItem('user_geolocation', JSON.stringify(coords));
        setState({ ...coords, loading: false, error: null, permissionDenied: false });
      },
      (err) => {
        setState(s => ({
          ...s,
          loading: false,
          error: err.message,
          permissionDenied: err.code === err.PERMISSION_DENIED,
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [requestOnMount]);

  return state;
};
