import axios from 'axios';

// Ia parola de acces (cheia API) din setări
const API_KEY =
  (import.meta.env.VITE_OPENWEATHER_API_KEY as string) || '';

// Adresa principală pentru vreme
const BASE_URL =
  (import.meta.env.VITE_OPENWEATHER_BASE_URL as string) ||
  'https://api.openweathermap.org/data/2.5';

// Adresa pentru a căuta orașe
const GEO_URL =
  (import.meta.env.VITE_OPENWEATHER_GEO_URL as string) ||
  'https://api.openweathermap.org/geo/1.0';

// Conexiunea care cere datele meteo
export const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  params: { appid: API_KEY },
});

// Conexiunea care caută orașele
export const geoApi = axios.create({
  baseURL: GEO_URL,
  timeout: 8000,
  params: { appid: API_KEY },
});

// Verifică dacă apar erori
const errorInterceptor = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) throw new Error('Parolă greșită (API Key).');
    if (status === 404) throw new Error('Orașul nu a fost găsit.');
    if (status === 429) throw new Error('Prea multe cereri. Așteaptă puțin.');
  }
  throw error;
};

// Pune verificarea de erori pe cele două conexiuni
weatherApi.interceptors.response.use((r) => r, errorInterceptor);
geoApi.interceptors.response.use((r) => r, errorInterceptor);
