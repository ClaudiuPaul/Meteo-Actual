import { useState, useEffect } from 'react';
import axios from 'axios';

interface TouristInfo {
  extract: string;
  thumbnail?: {
    source: string;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

export const useTouristInfo = (cityName: string | undefined) => {
  const [info, setInfo] = useState<TouristInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) {
      setInfo(null);
      return;
    }

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        // Încercăm mai întâi pe Wikipedia în limba română
        const response = await axios.get(
          `https://ro.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
        );
        setInfo(response.data);
      } catch (err: any) {
        // Dacă nu găsim pe Wikipedia RO, încercăm pe EN
        try {
          const responseEn = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
          );
          setInfo(responseEn.data);
        } catch (errEn) {
          setError('Nu am putut găsi informații pentru acest oraș.');
          setInfo(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [cityName]);

  return { info, loading, error };
};

