import { useState, useEffect, useCallback } from 'react';
import type { DailyForecast, HourlyForecast, TemperatureUnit, Coords } from '../types';
import {
  getForecastByCoords,
  getCurrentWeatherByCity,
} from '../services/weatherService';

interface ForecastState {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches 5-day / 3-hour forecast and aggregates into hourly + daily arrays.
 * Accepts either a Coords object or a city-name string.
 */
export const useForecast = (
  input: Coords | string | null,
  unit: TemperatureUnit
): ForecastState => {
  const [state, setState] = useState<ForecastState>({
    hourly: [],
    daily: [],
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    if (!input) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      let coords: Coords;

      if (typeof input === 'string') {
        // Resolve city name → coords via current-weather endpoint (cheaper than geocoding)
        const weather = await getCurrentWeatherByCity(input, unit);
        coords = weather.coords;
      } else {
        coords = input;
      }

      const forecastData = await getForecastByCoords(coords, unit);
      setState({ ...forecastData, loading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch forecast.';
      setState({ hourly: [], daily: [], loading: false, error: message });
    }
  }, [input, unit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return state;
};
