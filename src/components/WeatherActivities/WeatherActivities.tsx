import React from 'react';
import { Compass, Book, Coffee, Bike, Umbrella, Snowflake, Sun, Wind, Cloud, Home, Droplets, Map, Thermometer, Zap, Activity } from 'lucide-react';
import type { CurrentWeatherData, TemperatureUnit } from '../../types';

interface WeatherActivitiesProps {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
}

export const WeatherActivities: React.FC<WeatherActivitiesProps> = ({ data, unit }) => {
  const { temp, condition, windSpeed } = data;
  
  const tempC = unit === 'imperial' ? (temp - 32) * 5/9 : temp;

  let activities = [];

  // Determinăm recomandările pentru activități bazate pe starea vremii
  if (condition.main.toLowerCase().includes('rain') || condition.main.toLowerCase().includes('drizzle') || condition.main.toLowerCase().includes('thunderstorm')) {
    activities = [
      { text: 'Vreme ploioasă, nu este recomandat ciclismul.', icon: <Umbrella className="w-6 h-6 text-blue-400" /> },
      { text: 'Condiții optime pentru activități de interior.', icon: <Home className="w-6 h-6 text-indigo-300" /> },
      { text: 'Vizibilitatea în trafic poate fi redusă.', icon: <Compass className="w-6 h-6 text-gray-400" /> },
      { text: 'Moment perfect pentru o cafea caldă sau lectură.', icon: <Book className="w-6 h-6 text-orange-300" /> },
      { text: 'Umiditatea este ridicată, aerisește încăperile scurt.', icon: <Droplets className="w-6 h-6 text-cyan-300" /> },
      { text: 'Furtuni posibile, evită spațiile deschise.', icon: <Zap className="w-6 h-6 text-yellow-500" /> },
    ];
  } else if (condition.main.toLowerCase().includes('snow')) {
    activities = [
      { text: 'Afară ninge, îmbracă-te gros dacă ieși.', icon: <Snowflake className="w-6 h-6 text-blue-200" /> },
      { text: 'Condiții potrivite pentru sporturi de iarnă.', icon: <Wind className="w-6 h-6 text-indigo-200" /> },
      { text: 'Traficul poate fi îngreunat, condu cu prudență.', icon: <Compass className="w-6 h-6 text-gray-300" /> },
      { text: 'Temperaturi scăzute, risc de îngheț pe șosea.', icon: <Thermometer className="w-6 h-6 text-red-300" /> },
      { text: 'Vreme ideală pentru o ciocolată caldă la fereastră.', icon: <Coffee className="w-6 h-6 text-amber-500" /> },
    ];
  } else if (tempC > 28) {
    activities = [
      { text: 'Temperaturi foarte ridicate, evită efortul intens.', icon: <Thermometer className="w-6 h-6 text-red-500" /> },
      { text: 'Index UV crescut, folosește cremă cu protecție.', icon: <Umbrella className="w-6 h-6 text-amber-400" /> },
      { text: 'Vreme excelentă pentru mers la piscină.', icon: <Sun className="w-6 h-6 text-cyan-400" /> },
      { text: 'Hidratează-te constant pe parcursul zilei.', icon: <Droplets className="w-6 h-6 text-blue-300" /> },
      { text: 'Caută zonele cu aer condiționat sau umbră.', icon: <Home className="w-6 h-6 text-gray-300" /> },
      { text: 'Poartă haine lejere și de culori deschise.', icon: <Activity className="w-6 h-6 text-orange-300" /> },
    ];
  } else if (tempC > 15 && tempC <= 28 && windSpeed < 25) {
    activities = [
      { text: 'Vreme ideală și plăcută pentru ciclism.', icon: <Bike className="w-6 h-6 text-emerald-400" /> },
      { text: 'Condiții perfecte pentru o plimbare în parc.', icon: <Sun className="w-6 h-6 text-yellow-400" /> },
      { text: 'Aer curat, potrivit pentru sport în aer liber.', icon: <Wind className="w-6 h-6 text-cyan-300" /> },
      { text: 'Excelent pentru drumeții sau explorare.', icon: <Map className="w-6 h-6 text-indigo-400" /> },
      { text: 'Organizează un picnic sau o masă afară.', icon: <Coffee className="w-6 h-6 text-orange-400" /> },
    ];
  } else {
    activities = [
      { text: 'Vreme închisă sau moderată, bună pentru plimbări.', icon: <Cloud className="w-6 h-6 text-gray-400" /> },
      { text: 'Condiții normale pentru majoritatea activităților.', icon: <Compass className="w-6 h-6 text-indigo-300" /> },
      { text: 'Poți planifica ieșiri urbane fără griji majore.', icon: <Map className="w-6 h-6 text-blue-300" /> },
      { text: 'Temperaturile sunt optime pentru a vizita muzee.', icon: <Home className="w-6 h-6 text-purple-400" /> },
      { text: 'Timp excelent pentru a rezolva comisioane.', icon: <Activity className="w-6 h-6 text-green-400" /> },
    ];
  }

  return (
    // Redus padding-ul de la p-6 la p-4 pentru a face panoul mai mic și a se alinia mai bine
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl animate-fade-in flex flex-col h-full">
      <h3 className="text-white/80 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-white/10 pb-2" style={{ fontSize: '19px' }}>
        <Compass className="w-5 h-5 text-indigo-400" />
        Sumar Activități
      </h3>
      
      <div className="flex-1 flex flex-col justify-between py-1">
        {/* Redus spațierea între elemente de la space-y-4 la space-y-2 */}
        <ul className="flex flex-col flex-1 justify-around space-y-2 h-full">
          {activities.map((act, i) => (
            // Redus padding-ul fiecărui element de la p-3 la p-2
            <li key={i} className="flex items-center gap-3 group bg-white/5 p-2 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-slate-900/50 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {act.icon}
              </div>
              <span className="text-white/70 font-medium group-hover:text-white transition-colors leading-snug" style={{ fontSize: '19px' }}>
                {act.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
