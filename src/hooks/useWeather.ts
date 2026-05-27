import { useState, useEffect, useCallback } from 'react';
import type { CurrentWeatherData, TemperatureUnit, Coords, AirQualityData } from '../types';
import {
  getCurrentWeatherByCoords,
  getCurrentWeatherByCity,
  getAirQuality,
} from '../services/weatherService';

interface WeatherState {
  data: CurrentWeatherData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches current weather for either GPS coords or a city-name string.
 * Also fetches AQI for the resolved location.
 */
export const useWeather = (
  input: Coords | string | null,
  unit: TemperatureUnit
): WeatherState & { refetch: () => void } => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    airQuality: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    if (!input) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const weatherData =
        typeof input === 'string'
          ? await getCurrentWeatherByCity(input, unit)
          : await getCurrentWeatherByCoords(input, unit);

      const aqData = await getAirQuality(weatherData.coords);

      setState({ data: weatherData, airQuality: aqData, loading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch weather data.';
      setState((s) => ({ ...s, data: null, loading: false, error: message }));
    }
  }, [input, unit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
};