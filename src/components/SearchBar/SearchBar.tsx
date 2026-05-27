import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchCities } from '../../services/weatherService';
import { useWeatherContext } from '../../context/WeatherContext';
import type { GeocodingResult } from '../../types';

interface SearchBarProps {
  onSelect: (city: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { recentSearches, favorites, clearRecentSearches } = useWeatherContext();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchCities(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetch, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (cityName: string) => {
    onSelect(cityName);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-indigo-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:bg-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder:text-white/30 outline-none transition-all duration-300 shadow-lg"
          placeholder="Caută un oraș..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/30 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (query.length >= 2 || recentSearches.length > 0 || favorites.length > 0) && (
        <div className="absolute w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {loading && query.length >= 2 ? (
            <div className="p-4 flex items-center justify-center text-white/50">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3"
                    onClick={() => handleSelect(r.name)}
                  >
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">{r.name}</div>
                      <div className="text-white/40 text-xs truncate">
                        {r.state ? `${r.state}, ` : ''}{r.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-white/50 text-sm">Niciun oraș găsit.</div>
          ) : (
            <div className="py-2">
              {favorites.length > 0 && (
                <>
                  <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-white/30 font-bold">
                    Favorite
                  </div>
                  {favorites.slice(0, 3).map((f, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-3 text-amber-100"
                      onClick={() => handleSelect(f.name)}
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-sm truncate">{f.name}</span>
                    </button>
                  ))}
                </>
              )}
              {recentSearches.length > 0 && (
                <>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Căutări Recente</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearRecentSearches();
                      }}
                      className="text-[10px] uppercase tracking-wider text-red-400/60 hover:text-red-400 font-bold transition-colors duration-200"
                    >
                      Șterge tot
                    </button>
                  </div>
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-3 text-white/70"
                      onClick={() => handleSelect(s)}
                    >
                      <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      <span className="text-sm truncate">{s}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
