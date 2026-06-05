// ============================================================
// Toate tipurile de date folosite în aplicație
// ============================================================

/** Grade Celsius sau Fahrenheit */
export type TemperatureUnit = 'metric' | 'imperial';

/** Coordonate GPS */
export interface Coords {
  lat: number;
  lon: number;
}

/** Detalii despre starea vremii */
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/** Datele curente despre vreme */
export interface CurrentWeatherData {
  name: string;
  country: string;
  coords: Coords;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  condition: WeatherCondition;
  dt: number;
  timezone: number;
}

/** Datele de prognoză pe ore */
export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pop: number; // șansa de ploaie (între 0 și 1)
  condition: WeatherCondition;
}

/** Datele de prognoză pe zile */
export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  pop: number;
  condition: WeatherCondition;
}

/** Date despre calitatea aerului */
export interface AirQualityData {
  aqi: number; // Nivelul de poluare (1=Foarte bun, 5=Foarte slab)
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

/** Oraș favorit salvat */
export interface FavoriteCity {
  name: string;
  country: string;
  coords: Coords;
}

/** Rezultatul căutării unui oraș */
export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
