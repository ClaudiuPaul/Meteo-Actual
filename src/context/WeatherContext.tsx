import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { FavoriteCity, TemperatureUnit } from '../types';

// ─── Context shape ────────────────────────────────────────────────────────────

interface WeatherContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  favorites: FavoriteCity[];
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
  recentSearches: string[];
  addRecentSearch: (city: string) => void;
  clearRecentSearches: () => void;
  homeLocation: FavoriteCity | null;
  setHomeLocation: (city: FavoriteCity | null) => void;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

// ─── Local-storage helpers ────────────────────────────────────────────────────

const load = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const save = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<TemperatureUnit>(() =>
    load<TemperatureUnit>('wd_unit', 'metric')
  );
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() =>
    load<FavoriteCity[]>('wd_favorites', [])
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    load<string[]>('wd_recent', [])
  );
  const [homeLocation, setHomeLocationState] = useState<FavoriteCity | null>(() =>
    load<FavoriteCity | null>('wd_home', null)
  );

  const setHomeLocation = (city: FavoriteCity | null) => {
    setHomeLocationState(city);
    save('wd_home', city);
  };

  const toggleUnit = () => {
    const next: TemperatureUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(next);
    save('wd_unit', next);
  };

  const addFavorite = (city: FavoriteCity) => {
    setFavorites((prev) => {
      const updated = [city, ...prev.filter((f) => f.name !== city.name)].slice(0, 10);
      save('wd_favorites', updated);
      return updated;
    });
  };

  const removeFavorite = (name: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.name !== name);
      save('wd_favorites', updated);
      return updated;
    });
  };

  const isFavorite = (name: string) =>
    favorites.some((f) => f.name === name);

  const addRecentSearch = (city: string) => {
    setRecentSearches((prev) => {
      const updated = [city, ...prev.filter((s) => s !== city)].slice(0, 6);
      save('wd_recent', updated);
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    save('wd_recent', []);
  };

  return (
    <WeatherContext.Provider
      value={{ unit, toggleUnit, favorites, addFavorite, removeFavorite, isFavorite, recentSearches, addRecentSearch, clearRecentSearches, homeLocation, setHomeLocation }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useWeatherContext = (): WeatherContextType => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used inside <WeatherProvider>');
  return ctx;
};
