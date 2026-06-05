import type { TemperatureUnit } from '../types';

// ─── Temperatură ──────────────────────────────────────────────────────────────

export const formatTemp = (temp: number, unit: TemperatureUnit): string =>
  `${Math.round(temp)}°${unit === 'metric' ? 'C' : 'F'}`;

export const formatTempValue = (temp: number): number => Math.round(temp);

// ─── Timp / Dată ─────────────────────────────────────────────────────────────

/**
 * Transformă timpul într-un format de oră locală.
 */
export const formatLocalTime = (timestamp: number, timezoneOffset = 0): string => {
  const utc = timestamp + timezoneOffset;
  const date = new Date(utc * 1000);
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
};

export const formatDate = (timestamp: number): string =>
  new Date(timestamp * 1000).toLocaleDateString('ro-RO', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

export const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Azi';
  if (date.toDateString() === tomorrow.toDateString()) return 'Mâine';
  return date.toLocaleDateString('ro-RO', { weekday: 'short' });
};

export const formatHour = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  return `${hours % 12 || 12}${hours >= 12 ? 'PM' : 'AM'}`;
};

// ─── Vânt ────────────────────────────────────────────────────────────────────

export const getWindDirection = (deg: number): string => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SV', 'V', 'NV'];
  return dirs[Math.round(deg / 45) % 8];
};

export const formatWindSpeed = (speed: number, unit: TemperatureUnit): string => {
  // Returnează viteza vântului în km/h sau mph
  if (unit === 'metric') return `${Math.round(speed * 3.6)} km/h`;
  return `${Math.round(speed)} mph`;
};

// ─── Calitatea Aerului ─────────────────────────────────────────────────────────────

export const getAQIInfo = (
  aqi: number
): { label: string; color: string; ringColor: string } => {
  const info = [
    { label: 'Bună',      color: 'text-emerald-400', ringColor: 'ring-emerald-500/30' },
    { label: 'Acceptabilă',      color: 'text-yellow-400',  ringColor: 'ring-yellow-500/30'  },
    { label: 'Moderată',  color: 'text-orange-400',  ringColor: 'ring-orange-500/30'  },
    { label: 'Slabă',      color: 'text-red-400',     ringColor: 'ring-red-500/30'     },
    { label: 'Foarte Slabă', color: 'text-purple-400',  ringColor: 'ring-purple-500/30'  },
  ];
  return info[Math.min(aqi - 1, 4)] ?? info[0];
};

// ─── Vizibilitate ───────────────────────────────────────────────────────────────

export const getVisibilityText = (visibility: number): string => {
  const km = visibility / 1000;
  if (km >= 10) return 'Excelentă';
  if (km >= 5)  return 'Bună';
  if (km >= 2)  return 'Moderată';
  return 'Scăzută';
};

// ─── Diverse ────────────────────────────────────────────────────────────────────

export const capitalizeFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
