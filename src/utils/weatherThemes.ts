// ─── Teme pentru Vreme ──────────────────────────────────────────────────────────
// Alege culorile aplicației în funcție de vreme și de momentul zilei

export interface WeatherTheme {
  mainGradient: string;   // aplicat pe fundalul întregii pagini
  cardGradient: string;   // aplicat pe fundalul cardului meteo
  accentColor: string;    // culoare folosită pentru pictograme
  textAccent: string;     // culoare pentru textele scoase în evidență
}

export const getWeatherTheme = (conditionId: number, isNight: boolean): WeatherTheme => {
  // Furtună
  if (conditionId >= 200 && conditionId < 300) {
    return {
      mainGradient: 'from-indigo-950/90 via-slate-900 to-slate-950',
      cardGradient: 'from-purple-900/25 to-slate-900/10',
      accentColor: '#a855f7',
      textAccent: 'text-purple-300',
    };
  }
  // Burniță
  if (conditionId >= 300 && conditionId < 400) {
    return {
      mainGradient: 'from-teal-950/70 via-slate-900 to-slate-950',
      cardGradient: 'from-sky-900/25 to-slate-900/10',
      accentColor: '#38bdf8',
      textAccent: 'text-sky-300',
    };
  }
  // Ploaie
  if (conditionId >= 500 && conditionId < 600) {
    return {
      mainGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      cardGradient: 'from-blue-900/25 to-slate-900/10',
      accentColor: '#3b82f6',
      textAccent: 'text-blue-300',
    };
  }
  // Ninsoare
  if (conditionId >= 600 && conditionId < 700) {
    return {
      mainGradient: 'from-slate-900 via-slate-950 to-slate-950',
      cardGradient: 'from-slate-700/25 to-slate-900/10',
      accentColor: '#bae6fd',
      textAccent: 'text-sky-200',
    };
  }
  // Ceață / Atmosferă
  if (conditionId >= 700 && conditionId < 800) {
    return {
      mainGradient: 'from-slate-800/70 via-slate-900 to-slate-950',
      cardGradient: 'from-slate-600/20 to-slate-900/10',
      accentColor: '#94a3b8',
      textAccent: 'text-slate-400',
    };
  }
  // Cer senin
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
  // Nori
  return {
    mainGradient: 'from-blue-950/70 via-slate-900/90 to-slate-950',
    cardGradient: 'from-slate-700/20 to-slate-900/10',
    accentColor: '#94a3b8',
    textAccent: 'text-slate-300',
  };
};

/** Returnează imaginea cu starea vremii */
export const getWeatherIconUrl = (icon: string, size: '2x' | '4x' = '2x'): string =>
  `https://openweathermap.org/img/wn/${icon}@${size}.png`;

/** Verifică dacă e noapte */
export const isNightTime = (dt: number, sunrise: number, sunset: number): boolean =>
  dt < sunrise || dt > sunset;
