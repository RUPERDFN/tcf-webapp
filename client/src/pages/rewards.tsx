import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGamificationStore, LEVELS, POINT_VALUES } from '@/lib/stores/gamificationStore';
import { PointsDisplay } from '@/components/gamification/PointsDisplay';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { Button } from '@/components/ui/button';

export default function RewardsPage() {
  const [, setLocation] = useLocation();
  const { points, level, streak, badges, pointsHistory, getLevel, getLevelProgress } = useGamificationStore();
  const [activeNav, setActiveNav] = useState('profile');

  const currentLevel = getLevel();
  const progress = getLevelProgress();
  const nextLevel = LEVELS[level] || null;

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const lockedBadges = badges.filter(b => !b.unlockedAt);

  const pointsToNextLevel = nextLevel 
    ? nextLevel.minPoints - points 
    : 0;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setLocation('/dashboard')}
              className="text-gray-400 hover:text-white"
              data-testid="button-back"
            >
              ← Volver
            </button>
            <h1 className="text-xl text-chalk">SkinChef Rewards</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        <section className="card-tcf bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/30">
          <div className="flex flex-col items-center py-4">
            <LevelBadge size="lg" showName={true} />
            <div className="mt-4">
              <PointsDisplay size="lg" />
            </div>
            <div className="mt-2">
              <StreakCounter size="md" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progreso al siguiente nivel</span>
              {nextLevel && (
                <span className="text-yellow-400">
                  {pointsToNextLevel} pts para {nextLevel.name}
                </span>
              )}
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="card-tcf">
          <h2 className="text-xl text-chalk mb-4">📊 Niveles</h2>
          <div className="space-y-3">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.number}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  level === lvl.number
                    ? 'bg-yellow-500/20 border border-yellow-500/50'
                    : level > lvl.number
                    ? 'bg-white/5 opacity-60'
                    : 'bg-white/5 opacity-40'
                }`}
              >
                <span className="text-3xl">{lvl.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-white">{lvl.name}</div>
                  <div className="text-sm text-gray-400">
                    {lvl.maxPoints === Infinity
                      ? `${lvl.minPoints.toLocaleString()}+ puntos`
                      : `${lvl.minPoints.toLocaleString()} - ${lvl.maxPoints.toLocaleString()} puntos`}
                  </div>
                </div>
                {level >= lvl.number && (
                  <span className="text-accent-green text-xl">✓</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card-tcf">
          <h2 className="text-xl text-chalk mb-4">🏅 Insignias</h2>
          
          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-400 mb-3">Desbloqueadas ({unlockedBadges.length})</h3>
              <div className="grid grid-cols-3 gap-4">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    data-testid={`badge-${badge.id}`}
                  >
                    <span className="text-4xl mb-2">{badge.icon}</span>
                    <span className="text-sm font-bold text-white text-center">{badge.name}</span>
                    <span className="text-xs text-gray-400 text-center mt-1">{badge.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm text-gray-400 mb-3">Por desbloquear ({lockedBadges.length})</h3>
            <div className="grid grid-cols-3 gap-4">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 opacity-50"
                  data-testid={`badge-locked-${badge.id}`}
                >
                  <span className="text-4xl mb-2 grayscale">🔒</span>
                  <span className="text-sm font-bold text-gray-500 text-center">{badge.name}</span>
                  <span className="text-xs text-gray-600 text-center mt-1">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card-tcf">
          <h2 className="text-xl text-chalk mb-4">⭐ Cómo ganar puntos</h2>
          <div className="space-y-2">
            {Object.entries(POINT_VALUES).map(([key, value]) => {
              const labels: Record<string, string> = {
                COMPLETE_ONBOARDING: 'Completar onboarding',
                GENERATE_MENU: 'Generar menú semanal',
                COMPLETE_MEAL: 'Marcar comida como hecha',
                COMPLETE_DAY: 'Completar día entero (bonus)',
                COMPLETE_WEEK: 'Completar semana (bonus)',
                USE_HEALTHY_SUBSTITUTE: 'Usar sustituto saludable',
                STREAK_7_DAYS: 'Racha de 7 días',
                STREAK_30_DAYS: 'Racha de 30 días',
              };
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <span className="text-gray-300">{labels[key] || key}</span>
                  <span className="text-yellow-400 font-bold">+{value} pts</span>
                </div>
              );
            })}
          </div>
        </section>

        {pointsHistory.length > 0 && (
          <section className="card-tcf">
            <h2 className="text-xl text-chalk mb-4">📜 Historial reciente</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pointsHistory.slice().reverse().slice(0, 10).map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-white/5 text-sm"
                >
                  <span className="text-gray-400">{entry.reason}</span>
                  <span className="text-yellow-400">+{entry.amount}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-white/10 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {[
              { id: 'home', icon: '🏠', label: 'Inicio', path: '/dashboard' },
              { id: 'menu', icon: '📅', label: 'Menú', path: '/menu' },
              { id: 'shopping', icon: '🛒', label: 'Compra', path: '/shopping' },
              { id: 'profile', icon: '👤', label: 'Perfil', path: '/profile' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setLocation(item.path);
                }}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                  activeNav === item.id
                    ? 'text-accent-green'
                    : 'text-gray-500 hover:text-white'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
