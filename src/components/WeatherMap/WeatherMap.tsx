import React, { useEffect } from 'react';
import { LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coords } from '../../types';

// ─── Fix Leaflet default icon paths broken by bundlers ───────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Custom glow marker ───────────────────────────────────────────────────────
const glowIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:36px;height:36px;">
      <div style="
        position:absolute;inset:0;
        border-radius:50%;
        background:radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%);
        animation:pulse 2s ease-in-out infinite;
      "></div>
      <div style="
        position:absolute;top:4px;left:4px;right:4px;bottom:4px;
        background:linear-gradient(135deg,#6366f1,#8b5cf6);
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid rgba(255,255,255,0.4);
        box-shadow:0 4px 20px rgba(99,102,241,0.8);
      "></div>
    </div>
    <style>
      @keyframes pulse{0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.4);opacity:0.4}}
    </style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -34],
});

// ─── Inner component: smoothly flies to new coords ───────────────────────────
const MapMover: React.FC<{ coords: Coords }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([coords.lat, coords.lon], 11, { animate: true, duration: 1.4 });
  }, [coords, map]);
  return null;
};

// ─── Componentă pentru butonul de recentrare ──────────────────────────────────
const RecenterButton: React.FC<{ coords: Coords }> = ({ coords }) => {
  const map = useMap();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        map.flyTo([coords.lat, coords.lon], 11, { animate: true, duration: 1.4 });
      }}
      className="absolute bottom-4 right-4 z-[400] bg-slate-900/80 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-all group cursor-pointer"
      title="Centrează pe locația curentă"
    >
      <LocateFixed className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
    </button>
  );
};

// ─── Public component ─────────────────────────────────────────────────────────
interface WeatherMapProps {
  coords: Coords;
  cityName: string;
  country?: string;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ coords, cityName, country }) => {
  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      scrollWheelZoom={true}
      className="rounded-2xl"
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <MapMover coords={coords} />
      <RecenterButton coords={coords} />

      <Marker position={[coords.lat, coords.lon]} icon={glowIcon}>
        <Popup>
          <div style={{ textAlign: 'center', color: 'white', fontFamily: 'Inter,sans-serif' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{cityName}</div>
            {country && (
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>
                {country}
              </div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
              {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};
