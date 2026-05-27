import axios from 'axios';

const API_KEY =
  (import.meta.env.VITE_OPENWEATHER_API_KEY as string) || '';

const BASE_URL =
  (import.meta.env.VITE_OPENWEATHER_BASE_URL as string) ||
  'https://api.openweathermap.org/data/2.5';

const GEO_URL =
  (import.meta.env.VITE_OPENWEATHER_GEO_URL as string) ||
  'https://api.openweathermap.org/geo/1.0';

/** Axios instance for weather endpoints (/weather, /forecast, /air_pollution) */
export const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  params: { appid: API_KEY },
});

/** Axios instance for geocoding endpoint (/direct) */
export const geoApi = axios.create({
  baseURL: GEO_URL,
  timeout: 8000,
  params: { appid: API_KEY },
});

// ─── Shared error interceptor ─────────────────────────────────────────────────
const errorInterceptor = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) throw new Error('Invalid API key. Check your .env file.');
    if (status === 404) throw new Error('City not found. Please try another name.');
    if (status === 429) throw new Error('API rate limit reached. Try again shortly.');
  }
  throw error;
};

weatherApi.interceptors.response.use((r) => r, errorInterceptor);
geoApi.interceptors.response.use((r) => r, errorInterceptor);
