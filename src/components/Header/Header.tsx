import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { SearchBar } from '../SearchBar/SearchBar';
import { useWeatherContext } from '../../context/WeatherContext';

// Interfața pentru proprietățile componentei Header
interface HeaderProps {
  onSearch: (city: string) => void;
}

// Componenta Header care conține logo-ul, bara de căutare și butonul de schimbare a unității
export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  // Preluăm unitatea de măsură din context (metric sau imperial) și funcția de comutare
  const { unit, toggleUnit } = useWeatherContext();

  return (
    <header className="w-full py-6 flex flex-col md:flex-row items-center justify-between gap-6 z-40 relative">
      {/* Secțiunea Logo și Titlu */}
      {(() => {
        const now = new Date();
        const hour = now.getHours();
        const isNight = hour >= 21 || hour < 6;
        return (
          <div className="flex items-center gap-3 group cursor-default">
            <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${
              isNight 
                ? 'from-indigo-400 to-purple-600' 
                : 'from-amber-400 to-orange-500'
            } flex items-center justify-center shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${
              isNight
                ? 'group-hover:shadow-[0_0_25px_rgba(129,140,248,0.6)]'
                : 'group-hover:shadow-[0_0_25px_rgba(251,191,36,0.6)]'
            }`}>
              {isNight 
                ? <Moon className="w-6 h-6 text-white drop-shadow-md" />
                : <Sun className="w-6 h-6 text-white drop-shadow-md" />
              }
              <div className="absolute inset-0 rounded-xl border border-white/20" />
            </div>
            <div>
              <h1 className="font-bold text-white" style={{ fontSize: '30px', letterSpacing: '1.5px', textShadow: isNight ? '0 0 25px rgba(129,140,248,0.6), 0 10px 15px rgba(0,0,0,0.1)' : '0 0 25px rgba(251,191,36,0.6), 0 10px 15px rgba(0,0,0,0.1)' }}>Meteo Actual</h1>
            </div>
          </div>
        );
      })()}

      {/* Secțiunea Bara de Căutare și Schimbare Unitate */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Bara de căutare care se extinde pe ecranele mai mari */}
        <div className="flex-1 md:w-[320px] lg:w-[400px]">
          <SearchBar onSelect={onSearch} />
        </div>

        {/* Butonul pentru schimbarea unității de măsură (°C / °F) */}
        <button
          onClick={toggleUnit}
          aria-label="Schimbă unitatea de temperatură"
          className="relative overflow-hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 flex items-center justify-center text-white font-bold transition-all duration-300 shrink-0 shadow-lg group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
          °{unit === 'metric' ? 'C' : 'F'}
        </button>
      </div>
    </header>
  );
};
