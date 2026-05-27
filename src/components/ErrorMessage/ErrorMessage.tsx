import React from 'react';
import { AlertTriangle, MapPin, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: 'general' | 'location' | 'search';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  type = 'general',
}) => {
  const Icon = type === 'location' ? MapPin : AlertTriangle;

  const iconColors: Record<string, string> = {
    general: 'bg-red-500/10 text-red-400',
    location: 'bg-amber-500/10 text-amber-400',
    search: 'bg-orange-500/10 text-orange-400',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center animate-fade-in">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${iconColors[type]}`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <p className="text-white/60 text-sm leading-relaxed max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Încearcă din nou
        </button>
      )}
    </div>
  );
};
