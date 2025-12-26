import { useGamificationStore } from '@/lib/stores/gamificationStore';

interface StreakCounterProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StreakCounter({ size = 'md', showLabel = true }: StreakCounterProps) {
  const streak = useGamificationStore((state) => state.streak);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const labelClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const getFlameIntensity = () => {
    if (streak >= 30) return 'text-red-500 animate-pulse';
    if (streak >= 7) return 'text-orange-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex flex-col items-center" data-testid="streak-counter">
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        <span className={`transition-colors ${getFlameIntensity()}`}>🔥</span>
        <span className="font-bold text-white">{streak}</span>
      </div>
      {showLabel && (
        <span className={`${labelClasses[size]} text-gray-400`}>
          {streak === 1 ? 'día' : 'días seguidos'}
        </span>
      )}
    </div>
  );
}
