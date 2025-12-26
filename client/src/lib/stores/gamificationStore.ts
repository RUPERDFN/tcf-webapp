import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string | null;
}

export interface PointsHistory {
  amount: number;
  reason: string;
  timestamp: string;
}

export interface Level {
  number: number;
  name: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
}

export const LEVELS: Level[] = [
  { number: 1, name: 'Pinche', icon: '🥄', minPoints: 0, maxPoints: 500 },
  { number: 2, name: 'Cocinero', icon: '🍳', minPoints: 500, maxPoints: 1500 },
  { number: 3, name: 'Chef', icon: '👨‍🍳', minPoints: 1500, maxPoints: 3500 },
  { number: 4, name: 'Chef Ejecutivo', icon: '⭐', minPoints: 3500, maxPoints: 7000 },
  { number: 5, name: 'Master Chef', icon: '👑', minPoints: 7000, maxPoints: Infinity },
];

export const BADGES: Badge[] = [
  { id: 'primera_semana', name: 'Primera Semana', description: 'Completar tu primera semana', icon: '📅', unlockedAt: null },
  { id: 'equilibrado', name: 'Equilibrado', description: '7 días con menú equilibrado', icon: '⚖️', unlockedAt: null },
  { id: 'ahorrador', name: 'Ahorrador', description: 'Menú bajo presupuesto', icon: '💰', unlockedAt: null },
  { id: 'eco_chef', name: 'Eco-Chef', description: 'Usar ingredientes de temporada', icon: '🌱', unlockedAt: null },
  { id: 'consistente', name: 'Consistente', description: 'Racha de 30 días', icon: '🔥', unlockedAt: null },
  { id: 'masterchef', name: 'Masterchef', description: 'Llegar a nivel 5', icon: '👑', unlockedAt: null },
];

export const POINT_VALUES = {
  COMPLETE_ONBOARDING: 100,
  GENERATE_MENU: 50,
  COMPLETE_MEAL: 10,
  COMPLETE_DAY: 25,
  COMPLETE_WEEK: 100,
  USE_HEALTHY_SUBSTITUTE: 15,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
};

interface GamificationStore {
  points: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  badges: Badge[];
  achievements: Achievement[];
  pointsHistory: PointsHistory[];
  pendingNotification: { type: 'points' | 'badge' | 'level'; data: any } | null;

  addPoints: (amount: number, reason: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  checkDailyLogin: () => void;
  getLevel: () => Level;
  getLevelProgress: () => number;
  clearNotification: () => void;
}

const calculateLevel = (points: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i].number;
    }
  }
  return 1;
};

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      points: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      badges: BADGES.map(b => ({ ...b })),
      achievements: [],
      pointsHistory: [],
      pendingNotification: null,

      addPoints: (amount: number, reason: string) => {
        const newPoints = get().points + amount;
        const newLevel = calculateLevel(newPoints);
        const oldLevel = get().level;

        const historyEntry: PointsHistory = {
          amount,
          reason,
          timestamp: new Date().toISOString(),
        };

        set({
          points: newPoints,
          level: newLevel,
          pointsHistory: [...get().pointsHistory.slice(-50), historyEntry],
          pendingNotification: { type: 'points', data: { amount, reason } },
        });

        if (newLevel > oldLevel) {
          setTimeout(() => {
            set({
              pendingNotification: { type: 'level', data: LEVELS[newLevel - 1] },
            });
          }, 1500);
        }

        if (newLevel === 5 && oldLevel < 5) {
          get().unlockBadge('masterchef');
        }
      },

      incrementStreak: () => {
        const newStreak = get().streak + 1;
        set({ streak: newStreak, lastActiveDate: new Date().toISOString().split('T')[0] });

        if (newStreak === 7) {
          get().addPoints(POINT_VALUES.STREAK_7_DAYS, 'Racha de 7 días');
        } else if (newStreak === 30) {
          get().addPoints(POINT_VALUES.STREAK_30_DAYS, 'Racha de 30 días');
          get().unlockBadge('consistente');
        }
      },

      resetStreak: () => set({ streak: 0 }),

      unlockBadge: (badgeId: string) => {
        const badges = get().badges.map(badge =>
          badge.id === badgeId && !badge.unlockedAt
            ? { ...badge, unlockedAt: new Date().toISOString() }
            : badge
        );
        const unlockedBadge = badges.find(b => b.id === badgeId);
        
        set({ 
          badges,
          pendingNotification: { type: 'badge', data: unlockedBadge },
        });
      },

      checkDailyLogin: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = get().lastActiveDate;

        if (!lastActive) {
          set({ lastActiveDate: today, streak: 1 });
          return;
        }

        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          get().incrementStreak();
        } else if (diffDays > 1) {
          get().resetStreak();
          set({ lastActiveDate: today, streak: 1 });
        }
      },

      getLevel: () => {
        const level = get().level;
        return LEVELS[level - 1] || LEVELS[0];
      },

      getLevelProgress: () => {
        const points = get().points;
        const currentLevel = get().getLevel();
        
        if (currentLevel.maxPoints === Infinity) return 100;
        
        const levelPoints = points - currentLevel.minPoints;
        const levelRange = currentLevel.maxPoints - currentLevel.minPoints;
        return Math.min(100, Math.round((levelPoints / levelRange) * 100));
      },

      clearNotification: () => set({ pendingNotification: null }),
    }),
    {
      name: 'tcf-gamification',
    }
  )
);
