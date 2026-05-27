import React from 'react';
import { Droplets } from 'lucide-react';
import type { DailyForecast, TemperatureUnit } from '../../types';
import { formatDay, formatTemp, formatTempValue } from '../../utils/helpers';
import { getWeatherIconUrl } from '../../utils/weatherThemes';

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
  isFirst?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  forecast,
  unit,
  isFirst = false,
}) => {
  const { dt, tempMin, tempMax, condition, pop, humidity } = forecast;

  return (
    <div
      className={`
        flex flex-col items-center p-3 rounded-2xl cursor-default
        transition-all duration-300 hover:scale-105 group shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        ${isFirst
          ? 'bg-indigo-500/15 ring-1 ring-indigo-500/30'
          : 'bg-white/5 hover:bg-white/10'}
      `}
    >
      {/* Day label */}
      <span
        className={`text-base font-bold uppercase tracking-wide mb-2 truncate w-full text-center px-1 ${
          isFirst ? 'text-indigo-300' : 'text-white/50'
        }`}
        title={formatDay(dt)}
      >
        {isFirst ? 'Azi' : formatDay(dt)}
      </span>

      {/* Weather icon */}
      <img
        src={getWeatherIconUrl(condition.icon, '2x')}
        alt={condition.description}
        className="w-11 h-11 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />

      {/* Description */}
      <span className="text-base text-white/40 text-center mt-1 capitalize leading-tight px-1">
        {condition.description}
      </span>

      {/* Rain probability */}
      {pop > 0.05 && (
        <div className="flex items-center gap-1 mt-2">
          <Droplets className="w-3 h-3 text-blue-400" />
          <span className="text-lg text-blue-300 font-medium">
            {Math.round(pop * 100)}%
          </span>
        </div>
      )}

      {/* Temp range */}
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-xl font-bold text-white">
          {formatTempValue(tempMax)}°
        </span>
        <span className="text-lg text-white/35">
          {formatTempValue(tempMin)}°
        </span>
      </div>

      {/* Humidity bar */}
      <div className="w-full mt-2 px-1">
        <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${humidity}%` }}
          />
        </div>
      </div>
    </div>
  );
};
