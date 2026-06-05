import { useState, useEffect } from 'react';
import type { Coords } from '../types';

interface GeolocationState {
  coords: Coords | null;
  error: string | null;
  loading: boolean;
}

/**
 * Cere locația browser-ului la prima accesare.
 * Returnează coordonatele, erorile (dacă sunt) și starea de încărcare.
 */
export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchLocation = () => {
      const fallbackToIp = async (errorMessage?: string) => {
        try {
          const res = await fetch('https://ipwho.is/');
          const data = await res.json();
          if (data.success && data.latitude && data.longitude) {
            setState({
              coords: { lat: data.latitude, lon: data.longitude },
              error: null,
              loading: false,
            });
            return;
          }
          throw new Error('IP lookup failed');
        } catch {
          setState({
            coords: null,
            error: errorMessage || 'Failed to determine location.',
            loading: false,
          });
        }
      };

      if (!navigator.geolocation) {
        fallbackToIp('Geolocation is not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setState({
            coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
            error: null,
            loading: false,
          });
        },
        (err) => {
          // În caz că nu merg coordonatele GPS, folosim adresa IP ca rezervă
          fallbackToIp(err.code === 1 ? 'Location access denied. Showing approximate location.' : undefined);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300_000, // păstrează datele 5 minute
        }
      );
    };

    fetchLocation();
  }, []);

  return state;
};
