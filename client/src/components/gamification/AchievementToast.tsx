import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/lib/stores/gamificationStore';

export function AchievementToast() {
  const { pendingNotification, clearNotification } = useGamificationStore();
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<typeof pendingNotification>(null);

  useEffect(() => {
    if (pendingNotification) {
      setCurrentNotification(pendingNotification);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          clearNotification();
          setCurrentNotification(null);
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [pendingNotification, clearNotification]);

  if (!currentNotification) return null;

  const getContent = () => {
    switch (currentNotification.type) {
      case 'points':
        return (
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <div className="text-lg font-bold text-yellow-400">
                +{currentNotification.data.amount} puntos
              </div>
              <div className="text-sm text-gray-300">
                {currentNotification.data.reason}
              </div>
            </div>
          </div>
        );
      case 'badge':
        return (
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentNotification.data?.icon}</span>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                ¡Nueva insignia!
              </div>
              <div className="text-lg font-bold text-white">
                {currentNotification.data?.name}
              </div>
              <div className="text-sm text-gray-300">
                {currentNotification.data?.description}
              </div>
            </div>
          </div>
        );
      case 'level':
        return (
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentNotification.data?.icon}</span>
            <div>
              <div className="text-xs text-yellow-400 uppercase tracking-wider">
                ¡Subiste de nivel!
              </div>
              <div className="text-lg font-bold text-white">
                Nivel {currentNotification.data?.number}: {currentNotification.data?.name}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getBgClass = () => {
    switch (currentNotification.type) {
      case 'points':
        return 'bg-gradient-to-r from-yellow-600/90 to-orange-600/90';
      case 'badge':
        return 'bg-gradient-to-r from-purple-600/90 to-pink-600/90';
      case 'level':
        return 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90';
      default:
        return 'bg-gray-800/90';
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      data-testid="achievement-toast"
    >
      <div
        className={`${getBgClass()} backdrop-blur-sm rounded-xl px-6 py-4 shadow-2xl border border-white/20`}
      >
        {getContent()}
      </div>
    </div>
  );
}
