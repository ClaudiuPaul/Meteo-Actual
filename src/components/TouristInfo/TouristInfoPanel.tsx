import React from 'react';
import { Map, ArrowRight } from 'lucide-react';
import { useTouristInfo } from '../../hooks/useTouristInfo';
import { Loader } from '../Loader/Loader';

interface TouristInfoPanelProps {
  cityName: string;
}

export const TouristInfoPanel: React.FC<TouristInfoPanelProps> = ({ cityName }) => {
  const { info, loading, error } = useTouristInfo(cityName);

  if (!cityName) return null;

  const bgImage = info?.thumbnail?.source || '';

  return (
    <div className="w-full">
      {/* Wrapper exterior pentru border-ul de 1px tip glassmorphism */}
      <div className="p-[1px] bg-white/5 backdrop-blur-md rounded-[25px] border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
        {/* Container cu înălțime minimă crescută și poziție relativă pentru imaginea de fundal */}
        <div className="relative min-h-[550px] rounded-3xl overflow-hidden flex flex-col group border border-white/10 cursor-pointer">
          
          {/* Imaginea de fundal cu un blur fin */}
          {bgImage ? (
            <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(3.5px)' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-900" />
        )}
        
        {/* Overlay luminos (starea normală, vizibil când NU ești cu mouse-ul pe el) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 transition-opacity duration-700 group-hover:opacity-0" />
        
        {/* Overlay întunecat (starea de hover, vizibil când pui mouse-ul) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* Conținutul vizibil - aliniat la baza panoului (justify-end) */}
        <div className="relative z-10 p-8 flex flex-col h-full flex-1 justify-end overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader type="spinner" />
            </div>
          ) : error ? (
            <div className="text-white/80 text-lg flex-1 flex items-center justify-center">{error}</div>
          ) : info ? (
            <div className="flex flex-col gap-2">
              {/* Titlul - rămâne mereu vizibil */}
              <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2 drop-shadow-lg transition-transform duration-500 ease-out" style={{ fontSize: '22px' }}>
                <Map className="w-6 h-6 text-indigo-300" />
                Informații și Curiozități: {cityName}
              </h3>
              
              {/* Recipient care se deschide (slide up) la hover */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-3 pt-3 opacity-0 transform translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out">
                    <p className="text-white/95 text-lg leading-relaxed drop-shadow-md font-medium" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                      {info.extract}
                    </p>
                    
                    <div className="flex justify-center mt-4 pb-2">
                      <a 
                        href={info.content_urls?.desktop?.page || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Vezi detalii pe Wikipedia"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-110 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white/80 text-lg flex-1 flex items-center justify-center">Nu există date disponibile.</div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
