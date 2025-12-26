import { useGamificationStore, LEVELS } from '@/lib/stores/gamificationStore';

interface LevelBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showProgress?: boolean;
}

export function LevelBadge({ size = 'md', showName = true, showProgress = false }: LevelBadgeProps) {
  const { level, getLevelProgress } = useGamificationStore();
  const currentLevel = LEVELS[level - 1] || LEVELS[0];
  const progress = getLevelProgress();

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center" data-testid="level-badge">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500/50 flex items-center justify-center`}
      >
        {currentLevel.icon}
      </div>
      {showName && (
        <span className={`${textClasses[size]} text-yellow-400 font-medium mt-1`}>
          {currentLevel.name}
        </span>
      )}
      {showProgress && (
        <div className="w-full mt-2">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 mt-1">{progress}%</span>
        </div>
      )}
    </div>
  );
}
