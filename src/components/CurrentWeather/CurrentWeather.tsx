import React from 'react';
import { MapPin, Navigation, Star, Moon, CloudMoon } from 'lucide-react';
import type { CurrentWeatherData, AirQualityData, TemperatureUnit } from '../../types';
import { formatTemp, formatDate, formatLocalTime } from '../../utils/helpers';
import { getWeatherIconUrl, getWeatherTheme, isNightTime } from '../../utils/weatherThemes';
import { WeatherDetails } from '../WeatherDetails/WeatherDetails';

// Interfața care definește proprietățile componentei CurrentWeather
interface CurrentWeatherProps {
  data: CurrentWeatherData;
  airQuality: AirQualityData | null;
  unit: TemperatureUnit;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  /** Adevărat când acest card afișează locația GPS a utilizatorului */
  isGeo?: boolean;
  /** Ascunde detaliile extra (folosit în panouri mai compacte) */
  compact?: boolean;
}

// Componenta principală care afișează vremea curentă
export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  airQuality,
  unit,
  isFavorite = false,
  onToggleFavorite,
  isGeo = false,
  compact = false,
}) => {
  const { name, country, temp, tempMin, tempMax, condition, dt, timezone, sunrise, sunset } = data;
  // Verificăm dacă este noapte pentru a schimba tema culorilor
  const night = isNightTime(dt, sunrise, sunset);
  // Obținem tema de culori în funcție de condițiile meteo
  const theme = getWeatherTheme(condition.id, night);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.cardGradient} animate-fade-in shadow-[0_4px_20px_rgba(0,0,0,0.15)]`}>
      {/* Efect de strălucire ambientală în fundal */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: theme.accentColor }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: theme.accentColor }}
      />

      <div className="relative z-10 p-5">
        {/* ── Rândul de antet (Locație, Dată, Ora) ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              {isGeo ? (
                <Navigation className="w-4 h-4 text-indigo-400 shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
              <h2 className="text-white font-bold text-2xl leading-tight">{name}</h2>
              <span className="text-white/60 text-lg">{country}</span>
            </div>
            <p className="text-white/50 text-base mt-0.5">
              {formatDate(dt)} · {formatLocalTime(dt, timezone)}
            </p>
          </div>

          {/* Butonul pentru a adăuga / șterge de la favorite (nu este afișat pentru locația GPS) */}
          {!isGeo && onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Elimină de la favorite' : 'Adaugă la favorite'}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 shrink-0 ml-2 ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-white/8 text-white/30 hover:text-white/70'
              }`}
            >
              <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* ── Secțiunea cu Temperatura și Pictograma meteo ────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white tracking-tight leading-none" style={{ fontSize: '75px', fontWeight: 200 }}>
              {formatTemp(temp, unit)}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-white/55 text-base">
                Max: {formatTemp(tempMax, unit)}
              </span>
              <span className="text-white/55 text-base">
                Min: {formatTemp(tempMin, unit)}
              </span>
            </div>
            <p className={`${theme.textAccent} capitalize text-lg mt-1.5 font-medium`}>
              {condition.description}
            </p>
          </div>

          {condition.icon === '01n' ? (
            <div className="w-24 h-24 flex items-center justify-center shrink-0 animate-float">
              <Moon className="w-16 h-16 text-amber-200 drop-shadow-[0_0_20px_rgba(253,230,138,0.5)]" />
            </div>
          ) : condition.icon === '02n' ? (
            <div className="w-24 h-24 flex items-center justify-center shrink-0 animate-float">
              <CloudMoon className="w-16 h-16 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.4)]" />
            </div>
          ) : (
            <img
              src={getWeatherIconUrl(condition.icon, '4x')}
              alt={condition.description}
              className="w-24 h-24 drop-shadow-2xl animate-float shrink-0"
              loading="lazy"
            />
          )}
        </div>

        {/* ── Grila cu detalii suplimentare despre vreme ─────────────────────────────────────────── */}
        {!compact && (
          <div className="mt-4">
            <WeatherDetails data={data} airQuality={airQuality} unit={unit} />
          </div>
        )}
      </div>
    </div>
  );
};
