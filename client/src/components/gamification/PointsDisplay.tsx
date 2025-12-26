import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/lib/stores/gamificationStore';

interface PointsDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export function PointsDisplay({ size = 'md', showAnimation = true }: PointsDisplayProps) {
  const points = useGamificationStore((state) => state.points);
  const [displayedPoints, setDisplayedPoints] = useState(points);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (showAnimation && points !== displayedPoints) {
      setIsAnimating(true);
      const diff = points - displayedPoints;
      const step = Math.ceil(Math.abs(diff) / 20);
      const interval = setInterval(() => {
        setDisplayedPoints((prev) => {
          if (Math.abs(points - prev) <= step) {
            clearInterval(interval);
            setIsAnimating(false);
            return points;
          }
          return prev + (diff > 0 ? step : -step);
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayedPoints(points);
    }
  }, [points, showAnimation]);

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-xl px-4 py-2',
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-full bg-orange-500/20 text-orange-400 font-bold transition-transform ${
        sizeClasses[size]
      } ${isAnimating ? 'scale-110' : ''}`}
      data-testid="points-display"
    >
      <span>🔥</span>
      <span>{displayedPoints.toLocaleString()}</span>
      <span className="text-orange-300/70">pts</span>
    </div>
  );
}
