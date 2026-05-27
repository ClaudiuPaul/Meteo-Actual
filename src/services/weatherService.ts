import { weatherApi, geoApi } from './api';
import type {
  CurrentWeatherData,
  DailyForecast,
  HourlyForecast,
  AirQualityData,
  TemperatureUnit,
  Coords,
  GeocodingResult,
} from '../types';

// ─── Current Weather ──────────────────────────────────────────────────────────

export const getCurrentWeatherByCoords = async (
  coords: Coords,
  unit: TemperatureUnit
): Promise<CurrentWeatherData> => {
  const { data } = await weatherApi.get('/weather', {
    params: { lat: coords.lat, lon: coords.lon, units: unit, lang: 'ro' },
  });
  return mapCurrentWeather(data);
};

export const getCurrentWeatherByCity = async (
  city: string,
  unit: TemperatureUnit
): Promise<CurrentWeatherData> => {
  const { data } = await weatherApi.get('/weather', {
    params: { q: city, units: unit, lang: 'ro' },
  });
  return mapCurrentWeather(data);
};

// ─── Forecast (free-tier 5-day / 3-hour) ────────────────────────────────────

export const getForecastByCoords = async (
  coords: Coords,
  unit: TemperatureUnit
): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> => {
  const { data } = await weatherApi.get('/forecast', {
    params: { lat: coords.lat, lon: coords.lon, units: unit, lang: 'ro' },
  });
  return mapForecast(data.list);
};

// ─── Air Quality ─────────────────────────────────────────────────────────────

export const getAirQuality = async (coords: Coords): Promise<AirQualityData | null> => {
  try {
    const { data } = await weatherApi.get('/air_pollution', {
      params: { lat: coords.lat, lon: coords.lon },
    });
    const item = data.list[0];
    return {
      aqi: item.main.aqi,
      co: item.components.co,
      no: item.components.no,
      no2: item.components.no2,
      o3: item.components.o3,
      so2: item.components.so2,
      pm2_5: item.components.pm2_5,
      pm10: item.components.pm10,
      nh3: item.components.nh3,
    };
  } catch {
    return null; // AQI is bonus data — never block the UI for it
  }
};

// ─── City Search / Autocomplete ───────────────────────────────────────────────

export const searchCities = async (query: string): Promise<GeocodingResult[]> => {
  if (!query.trim()) return [];
  const { data } = await geoApi.get('/direct', { params: { q: query, limit: 5 } });
  return (data as any[]).map((item) => ({
    name: item.name,
    country: item.country,
    state: item.state as string | undefined,
    lat: item.lat as number,
    lon: item.lon as number,
  }));
};

// ─── Mappers ─────────────────────────────────────────────────────────────────

const mapCurrentWeather = (d: any): CurrentWeatherData => {
  let name = d.name;
  if (['Teliucu Mic', 'Teliucu Inferior', 'Teliuc'].includes(name)) {
    name = 'Hunedoara';
  }

  return {
    name,
    country: d.sys.country,
    coords: { lat: d.coord.lat, lon: d.coord.lon },
  temp: d.main.temp,
  feelsLike: d.main.feels_like,
  tempMin: d.main.temp_min,
  tempMax: d.main.temp_max,
  humidity: d.main.humidity,
  pressure: d.main.pressure,
  windSpeed: d.wind?.speed ?? 0,
  windDeg: d.wind?.deg ?? 0,
  visibility: d.visibility ?? 10000,
  sunrise: d.sys.sunrise,
  sunset: d.sys.sunset,
  condition: {
    id: d.weather[0].id,
    main: d.weather[0].main,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
  },
  dt: d.dt,
  timezone: d.timezone,
  };
};

const mapForecast = (
  list: any[]
): { hourly: HourlyForecast[]; daily: DailyForecast[] } => {
  // Hourly — next 8 slots (3-hour intervals = 24 h)
  const hourly: HourlyForecast[] = list.slice(0, 8).map((item: any) => ({
    dt: item.dt,
    temp: item.main.temp,
    feelsLike: item.main.feels_like,
    humidity: item.main.humidity,
    windSpeed: item.wind?.speed ?? 0,
    pop: item.pop ?? 0,
    condition: {
      id: item.weather[0].id,
      main: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    },
  }));

  // Daily — group by calendar date, pick midday slot
  const groups = new Map<string, any[]>();
  list.forEach((item: any) => {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  });

  const daily: DailyForecast[] = Array.from(groups.values()).map((items) => {
    const temps = items.map((i: any) => i.main.temp as number);
    const mid = items[Math.floor(items.length / 2)];
    return {
      dt: mid.dt,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      humidity: Math.round(
        items.reduce((s: number, i: any) => s + (i.main.humidity as number), 0) / items.length
      ),
      windSpeed: mid.wind?.speed ?? 0,
      pop: Math.max(...items.map((i: any) => (i.pop as number) ?? 0)),
      condition: {
        id: mid.weather[0].id,
        main: mid.weather[0].main,
        description: mid.weather[0].description,
        icon: mid.weather[0].icon,
      },
    };
  });

  return { hourly, daily };
};
