// ─── Weather Theming ──────────────────────────────────────────────────────────
// Returns Tailwind gradient + accent colour based on OWM condition ID & time of day

export interface WeatherTheme {
  mainGradient: string;   // applied to full-page background blob
  cardGradient: string;   // applied to the weather card background
  accentColor: string;    // raw hex, used for SVG / inline styles
  textAccent: string;     // Tailwind text class for accent labels
}

export const getWeatherTheme = (conditionId: number, isNight: boolean): WeatherTheme => {
  // Thunderstorm 200-299
  if (conditionId >= 200 && conditionId < 300) {
    return {
      mainGradient: 'from-indigo-950/90 via-slate-900 to-slate-950',
      cardGradient: 'from-purple-900/25 to-slate-900/10',
      accentColor: '#a855f7',
      textAccent: 'text-purple-300',
    };
  }
  // Drizzle 300-399
  if (conditionId >= 300 && conditionId < 400) {
    return {
      mainGradient: 'from-teal-950/70 via-slate-900 to-slate-950',
      cardGradient: 'from-sky-900/25 to-slate-900/10',
      accentColor: '#38bdf8',
      textAccent: 'text-sky-300',
    };
  }
  // Rain 500-599
  if (conditionId >= 500 && conditionId < 600) {
    return {
      mainGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      cardGradient: 'from-blue-900/25 to-slate-900/10',
      accentColor: '#3b82f6',
      textAccent: 'text-blue-300',
    };
  }
  // Snow 600-699
  if (conditionId >= 600 && conditionId < 700) {
    return {
      mainGradient: 'from-slate-900 via-slate-950 to-slate-950',
      cardGradient: 'from-slate-700/25 to-slate-900/10',
      accentColor: '#bae6fd',
      textAccent: 'text-sky-200',
    };
  }
  // Atmosphere (fog, mist, haze …) 700-799
  if (conditionId >= 700 && conditionId < 800) {
    return {
      mainGradient: 'from-slate-800/70 via-slate-900 to-slate-950',
      cardGradient: 'from-slate-600/20 to-slate-900/10',
      accentColor: '#94a3b8',
      textAccent: 'text-slate-400',
    };
  }
  // Clear sky 800
  if (conditionId === 800) {
    if (isNight) {
      return {
        mainGradient: 'from-indigo-950 via-slate-900 to-slate-950',
        cardGradient: 'from-indigo-900/25 to-slate-900/10',
        accentColor: '#818cf8',
        textAccent: 'text-indigo-300',
      };
    }
    return {
      mainGradient: 'from-sky-900/60 via-slate-900/90 to-slate-950',
      cardGradient: 'from-amber-900/25 to-orange-900/10',
      accentColor: '#fbbf24',
      textAccent: 'text-amber-300',
    };
  }
  // Clouds 801-804
  return {
    mainGradient: 'from-blue-950/70 via-slate-900/90 to-slate-950',
    cardGradient: 'from-slate-700/20 to-slate-900/10',
    accentColor: '#94a3b8',
    textAccent: 'text-slate-300',
  };
};

/** Returns the OpenWeather icon CDN URL */
export const getWeatherIconUrl = (icon: string, size: '2x' | '4x' = '2x'): string =>
  `https://openweathermap.org/img/wn/${icon}@${size}.png`;

/** Returns true when the current time is after sunset or before sunrise */
export const isNightTime = (dt: number, sunrise: number, sunset: number): boolean =>
  dt < sunrise || dt > sunset;
