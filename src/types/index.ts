// ============================================================
// All TypeScript interfaces and types for the Weather Dashboard
// ============================================================

/** Celsius (metric) or Fahrenheit (imperial) */
export type TemperatureUnit = 'metric' | 'imperial';

/** Geographic coordinates */
export interface Coords {
  lat: number;
  lon: number;
}

/** OpenWeather weather condition object */
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/** Normalized current weather data */
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

/** Hourly forecast data point (from /forecast endpoint) */
export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pop: number; // probability of precipitation 0–1
  condition: WeatherCondition;
}

/** Aggregated daily forecast */
export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  pop: number;
  condition: WeatherCondition;
}

/** Air Quality Index data */
export interface AirQualityData {
  aqi: number; // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

/** Saved favourite city */
export interface FavoriteCity {
  name: string;
  country: string;
  coords: Coords;
}

/** Result from OpenWeather Geocoding API */
export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
