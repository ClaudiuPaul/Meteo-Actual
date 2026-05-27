import React, { useMemo } from 'react';
import type { HourlyForecast, TemperatureUnit } from '../../types';
import { formatHour, formatTempValue } from '../../utils/helpers';
import { getWeatherIconUrl } from '../../utils/weatherThemes';

interface TemperatureChartProps {
  hourlyData: HourlyForecast[];
  unit: TemperatureUnit;
}

const CHART_W = 760;
const CHART_H = 120;
const PAD = { top: 28, right: 16, bottom: 24, left: 8 };

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  hourlyData,
  unit,
}) => {
  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;

  const { points, linePath, areaPath } = useMemo(() => {
    if (!hourlyData.length) return { points: [], linePath: '', areaPath: '' };

    const temps = hourlyData.map((h) => h.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    const n = hourlyData.length;

    const pts = hourlyData.map((h, i) => ({
      x: PAD.left + (i / (n - 1)) * plotW,
      y: PAD.top + ((max - h.temp) / range) * plotH,
      ...h,
    }));

    // Smooth cubic bezier path
    let line = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].x + pts[i].x) / 2;
      line += ` C ${cpx} ${pts[i - 1].y}, ${cpx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    const area = `${line} L ${pts[pts.length - 1].x} ${CHART_H - PAD.bottom} L ${pts[0].x} ${CHART_H - PAD.bottom} Z`;

    return { points: pts, linePath: line, areaPath: area };
  }, [hourlyData, plotW, plotH]);

  if (!hourlyData.length) return null;

  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 380 }}>
        {/* Icon row */}
        <div
          className="flex justify-between mb-1"
          style={{ paddingLeft: PAD.left, paddingRight: PAD.right }}
        >
          {hourlyData.map((h, i) => (
            <img
              key={i}
              src={getWeatherIconUrl(h.condition.icon)}
              alt={h.condition.description}
              className="w-7 h-7 opacity-75"
              loading="lazy"
            />
          ))}
        </div>

        {/* SVG chart */}
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: CHART_H }}
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGrad)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Data points + labels */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r={5} fill="rgba(99,102,241,0.3)" />
              <circle cx={pt.x} cy={pt.y} r={2.5} fill="#a5b4fc" filter="url(#glow)" />
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="10"
                fontWeight="600"
                fontFamily="Inter,sans-serif"
              >
                {formatTempValue(pt.temp)}°
              </text>
            </g>
          ))}
        </svg>

        {/* Time + rain labels */}
        <div
          className="flex justify-between mt-1"
          style={{ paddingLeft: PAD.left, paddingRight: PAD.right }}
        >
          {hourlyData.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5" style={{ flex: 1 }}>
              <span className="text-[10px] text-white/35">{formatHour(h.dt)}</span>
              {h.pop > 0.05 && (
                <span className="text-[9px] text-blue-400 font-medium">
                  {Math.round(h.pop * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
