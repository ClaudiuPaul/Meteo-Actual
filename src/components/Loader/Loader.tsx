import React from 'react';

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[220px]">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-400 animate-spin" />
      <div
        className="absolute inset-[5px] rounded-full border-[3px] border-transparent border-t-violet-400 animate-spin"
        style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}
      />
      <div className="absolute inset-[10px] rounded-full bg-indigo-500/10 animate-pulse-slow" />
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonBar: React.FC<{ w?: string; h?: string; rounded?: string }> = ({
  w = 'w-full',
  h = 'h-4',
  rounded = 'rounded-full',
}) => (
  <div
    className={`${w} ${h} ${rounded} bg-white/8 relative overflow-hidden`}
    style={{
      background:
        'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.8s infinite',
    }}
  />
);

const SkeletonCard: React.FC = () => (
  <div className="p-6 space-y-5 animate-fade-in">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <SkeletonBar w="w-36" h="h-5" />
        <SkeletonBar w="w-20" h="h-3" />
      </div>
      <div
        className="w-20 h-20 rounded-full ml-4 flex-shrink-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.8s infinite',
        }}
      />
    </div>
    <div className="space-y-2">
      <SkeletonBar w="w-48" h="h-16" rounded="rounded-2xl" />
      <SkeletonBar w="w-32" h="h-4" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBar key={i} h="h-16" rounded="rounded-2xl" />
      ))}
    </div>
  </div>
);

// ─── Public component ────────────────────────────────────────────────────────

interface LoaderProps {
  type?: 'spinner' | 'skeleton';
}

export const Loader: React.FC<LoaderProps> = ({ type = 'spinner' }) =>
  type === 'skeleton' ? <SkeletonCard /> : <Spinner />;
