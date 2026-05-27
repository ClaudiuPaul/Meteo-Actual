import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Activity,
  Sunrise,
  Sunset,
} from 'lucide-react';
import type { CurrentWeatherData, AirQualityData, TemperatureUnit } from '../../types';
import {
  formatTemp,
  formatWindSpeed,
  formatLocalTime,
  getAQIInfo,
  getVisibilityText,
  getWindDirection,
} from '../../utils/helpers';

// Interfața pentru proprietățile principale
interface WeatherDetailsProps {
  data: CurrentWeatherData;
  airQuality: AirQualityData | null;
  unit: TemperatureUnit;
}

// Interfața pentru un singur element din grila de detalii
interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconColor?: string;
}

// Componenta pentru un singur element informativ
const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  sub,
  iconColor = 'text-indigo-400',
}) => (
  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 group shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
    <div className={`${iconColor} shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-white/55 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white font-semibold text-lg leading-tight">{value}</p>
      {sub && <p className="text-white/50 text-sm mt-px leading-tight">{sub}</p>}
    </div>
  </div>
);

// Componenta care randează grila cu toate detaliile meteo
export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  data,
  airQuality,
  unit,
}) => {
  const { humidity, pressure, windSpeed, windDeg, visibility, feelsLike, sunrise, sunset, timezone } = data;
  const aqiInfo = airQuality ? getAQIInfo(airQuality.aqi) : null;

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
      {/* Temperatura resimțită */}
      <DetailItem
        icon={<Thermometer className="w-4 h-4" />}
        label="Se simte ca"
        value={formatTemp(feelsLike, unit)}
        iconColor="text-orange-400"
      />
      <DetailItem
        icon={<Droplets className="w-4 h-4" />}
        label="Umiditate"
        value={`${humidity}%`}
        sub={humidity > 70 ? 'Ridicată' : humidity > 40 ? 'Normală' : 'Scăzută'}
        iconColor="text-blue-400"
      />
      <DetailItem
        icon={<Wind className="w-4 h-4" />}
        label="Vânt"
        value={formatWindSpeed(windSpeed, unit)}
        sub={getWindDirection(windDeg)}
        iconColor="text-teal-400"
      />
      <DetailItem
        icon={<Gauge className="w-4 h-4" />}
        label="Presiune"
        value={`${pressure} hPa`}
        sub={pressure > 1013 ? 'Mare' : 'Mică'}
        iconColor="text-violet-400"
      />
      <DetailItem
        icon={<Eye className="w-4 h-4" />}
        label="Vizibilitate"
        value={`${(visibility / 1000).toFixed(1)} km`}
        sub={getVisibilityText(visibility)}
        iconColor="text-cyan-400"
      />
      {aqiInfo && airQuality && (
        <DetailItem
          icon={<Activity className="w-4 h-4" />}
          label="Calitatea Aerului"
          value={`AQI ${airQuality.aqi}`}
          sub={aqiInfo.label}
          iconColor={aqiInfo.color}
        />
      )}
      <DetailItem
        icon={<Sunrise className="w-4 h-4" />}
        label="Răsărit"
        value={formatLocalTime(sunrise, timezone)}
        iconColor="text-amber-400"
      />
      <DetailItem
        icon={<Sunset className="w-4 h-4" />}
        label="Apus"
        value={formatLocalTime(sunset, timezone)}
        iconColor="text-rose-400"
      />
    </div>
  );
};
