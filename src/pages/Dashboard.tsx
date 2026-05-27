import React, { useState, useEffect } from 'react';
import { MapPin, Info, CalendarDays, LineChart } from 'lucide-react';
import { Header } from '../components/Header/Header';
import { CurrentWeather } from '../components/CurrentWeather/CurrentWeather';
import { ForecastCard } from '../components/ForecastCard/ForecastCard';
import { TemperatureChart } from '../components/TemperatureChart/TemperatureChart';
import { WeatherMap } from '../components/WeatherMap/WeatherMap';
import { Loader } from '../components/Loader/Loader';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';
import { WeatherActivities } from '../components/WeatherActivities/WeatherActivities';

import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import { useForecast } from '../hooks/useForecast';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherTheme } from '../utils/weatherThemes';
import type { Coords, FavoriteCity } from '../types';

export const Dashboard: React.FC = () => {
  const { unit, isFavorite, addFavorite, removeFavorite, addRecentSearch, homeLocation, setHomeLocation } = useWeatherContext();
  
  // 1. Get User GPS
  const geo = useGeolocation();
  
  // 2. State for the right panel (Search)
  const [searchedCity, setSearchedCity] = useState<string | null>(null);

  // 3. Fetch Weather & Forecast for LEFT panel (Home or GPS)
  const leftCoords = homeLocation ? homeLocation.coords : geo.coords;
  const geoWeather = useWeather(leftCoords, unit);

  // 4. Fetch Weather & Forecast for RIGHT panel (Search)
  const targetLocation = searchedCity || geo.coords; // fallback right panel to GPS if no search
  const rightWeather = useWeather(targetLocation, unit);
  const rightForecast = useForecast(targetLocation, unit);

  // Handlers
  const handleSearch = (city: string) => {
    setSearchedCity(city);
    addRecentSearch(city);
  };

  const handleToggleFavorite = () => {
    if (!rightWeather.data) return;
    const cityObj: FavoriteCity = {
      name: rightWeather.data.name,
      country: rightWeather.data.country,
      coords: rightWeather.data.coords,
    };
    if (isFavorite(cityObj.name)) {
      removeFavorite(cityObj.name);
    } else {
      addFavorite(cityObj);
    }
  };

  const handleSetHome = () => {
    if (!rightWeather.data) return;
    setHomeLocation({
      name: rightWeather.data.name,
      country: rightWeather.data.country,
      coords: rightWeather.data.coords,
    });
  };

  // Dynamic Background based on Right Panel Weather
  // Removed dynamic document.body background as it's replaced by a static background image in Layout.tsx

  return (
    <>
      <Header onSearch={handleSearch} />

      <div className="flex flex-col gap-6 mt-2">
        {/* ======================= RÂNDUL 1 (2 Coloane) ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ======================= COLOANA STÂNGA: LOCAȚIA CURENTĂ ======================= */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
              <h3 className="text-white/80 font-bold uppercase tracking-widest mb-4 flex items-center justify-between" style={{ fontSize: '19px' }}>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  {homeLocation ? 'Locație Principală' : 'Locația Curentă'}
                </span>
                {homeLocation && (
                  <button 
                    onClick={() => setHomeLocation(null)}
                    className="text-[10px] text-white/50 hover:text-indigo-400 transition-colors bg-white/5 px-2 py-1 rounded-md"
                  >
                    Folosește GPS
                  </button>
                )}
              </h3>
              
              {!homeLocation && geo.loading ? (
                <Loader type="skeleton" />
              ) : !homeLocation && geo.error ? (
                <ErrorMessage message={geo.error} type="location" />
              ) : geoWeather.loading ? (
                <Loader type="skeleton" />
              ) : geoWeather.error ? (
                <ErrorMessage message={geoWeather.error} onRetry={geoWeather.refetch} />
              ) : geoWeather.data ? (
                <div className="flex flex-col flex-1 gap-4">
                  {/* Partea de sus: Harta (crește să umple spațiul disponibil) */}
                  <div className="rounded-2xl overflow-hidden border border-white/10 relative flex-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)]" style={{ minHeight: '250px' }}>
                    <WeatherMap 
                      coords={geoWeather.data.coords} 
                      cityName={geoWeather.data.name} 
                      country={geoWeather.data.country}
                    />
                  </div>
                  {/* Partea de jos: Informații meteo (dimensiune naturală, lipită de baza panoului) */}
                  <div className="shrink-0">
                    <CurrentWeather 
                      data={geoWeather.data} 
                      airQuality={geoWeather.airQuality} 
                      unit={unit} 
                      isGeo 
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
            
          {/* ======================= COLOANA DREAPTA: DETALII METEO & SUMAR ======================= */}
          <div className="lg:col-span-7 flex flex-col h-full gap-6">
            {/* Detalii Meteo */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              {rightWeather.loading ? (
                <Loader type="skeleton" />
              ) : rightWeather.error ? (
                <ErrorMessage message={rightWeather.error} type="search" onRetry={rightWeather.refetch} />
              ) : rightWeather.data ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white/80 font-bold uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '19px' }}>
                      <Info className="w-5 h-5 text-indigo-400" />
                      {searchedCity ? 'Rezultatul Căutării' : 'Detalii Meteo'}
                    </h3>
                    {searchedCity && (
                      <button 
                        onClick={handleSetHome}
                        className="text-xs uppercase font-bold tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg"
                      >
                        Setează ca Principală
                      </button>
                    )}
                  </div>
                  <CurrentWeather 
                    data={rightWeather.data} 
                    airQuality={rightWeather.airQuality} 
                    unit={unit}
                    isFavorite={isFavorite(rightWeather.data.name)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </>
              ) : (
                <div className="h-40 flex items-center justify-center text-white/50 text-base">
                  Caută un oraș pentru a vedea detaliile.
                </div>
              )}
            </div>
            
            {/* Sumar Activități */}
            <div className="flex-1">
              {rightWeather.data && (
                <WeatherActivities data={rightWeather.data} unit={unit} />
              )}
            </div>
          </div>
        </div>

        {/* ======================= RÂNDUL 2: PROGNOZA (Full Width) ======================= */}
        <div className="w-full">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col">
            <h3 className="text-white/80 font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ fontSize: '19px' }}>
              <CalendarDays className="w-5 h-5 text-indigo-400" />
              Prognoza pe 7 Zile
            </h3>
            
            {rightForecast.loading ? (
              <Loader type="spinner" />
            ) : rightForecast.error ? (
              <ErrorMessage message={rightForecast.error} />
            ) : rightForecast.daily.length > 0 ? (
              <div className="flex flex-col gap-6">
                {/* Daily Cards Horizontal List */}
                <div className="flex overflow-x-auto pb-2 gap-3 snap-x no-scrollbar">
                  {rightForecast.daily.slice(0, 7).map((day, idx) => (
                    <div key={day.dt} className="min-w-[100px] flex-1 snap-start">
                      <ForecastCard 
                        forecast={day} 
                        unit={unit} 
                        isFirst={idx === 0} 
                      />
                    </div>
                  ))}
                </div>

                {/* Hourly Chart */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <h4 className="text-white/50 font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ fontSize: '17px' }}>
                    <LineChart className="w-5 h-5 text-indigo-400/70" />
                    Temperatura 24h
                  </h4>
                  <TemperatureChart hourlyData={rightForecast.hourly} unit={unit} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </>
  );
};
