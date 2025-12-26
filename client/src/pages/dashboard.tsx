import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';
import { useGamificationStore, LEVELS } from '@/lib/stores/gamificationStore';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PointsDisplay, StreakCounter, LevelBadge } from '@/components/gamification';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dayFullNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const getMealIcon = (meal: string) => {
  switch (meal.toLowerCase()) {
    case 'desayuno': return '🍳';
    case 'almuerzo': return '🥪';
    case 'comida': return '🍲';
    case 'merienda': return '🍰';
    case 'cena': return '🍽️';
    default: return '🍴';
  }
};

const getMealTime = (meal: string) => {
  switch (meal.toLowerCase()) {
    case 'desayuno': return '8:00';
    case 'almuerzo': return '11:00';
    case 'comida': return '14:00';
    case 'merienda': return '17:00';
    case 'cena': return '21:00';
    default: return '';
  }
};

export default function DashboardPage() {
  const { menu, shoppingList } = useDashboardStore();
  const { data: onboardingData } = useOnboardingStore();
  const { points, streak, level, checkDailyLogin, getLevel, getLevelProgress } = useGamificationStore();
  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    checkDailyLogin();
  }, []);

  const today = new Date();
  const todayName = dayFullNames[today.getDay()];
  const todayDate = today.getDate();
  const todayMonth = monthNames[today.getMonth()];

  const currentLevel = getLevel();
  const levelProgress = getLevelProgress();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      name: dayNames[date.getDay()],
      date: date.getDate(),
      isToday: i === 0,
      completed: Math.random() > 0.5,
    };
  });

  const todayMeals = [
    { id: '1', name: 'Tostadas con aguacate', meal: 'Desayuno', time: '15 min' },
    { id: '2', name: 'Ensalada mediterránea', meal: 'Comida', time: '25 min' },
    { id: '3', name: 'Pasta al pesto', meal: 'Cena', time: '20 min' },
  ];

  const pendingItems = shoppingList.filter(item => !item.checked).slice(0, 5);
  const totalPending = shoppingList.filter(item => !item.checked).length;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logos/logo.png" alt="TheCookFlow" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold text-chalk">TheCookFlow</h1>
              <p className="text-xs text-gray-400">¡Hola, Chef!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/rewards')} data-testid="button-points">
              <PointsDisplay size="sm" />
            </button>
            <button className="relative" data-testid="button-notifications">
              <span className="text-2xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">2</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-accent-green flex items-center justify-center text-lg font-bold">
              👤
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        <section className="card-tcf">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-chalk">Tu Menú de Esta Semana</h2>
            <button
              onClick={() => setLocation('/loading')}
              className="text-sm text-accent-green hover:underline flex items-center gap-1"
              data-testid="button-regenerate"
            >
              🔄 Nuevo menú
            </button>
          </div>

          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-4">
              {weekDays.map((day, i) => (
                <button
                  key={i}
                  className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 transition-all ${
                    day.isToday
                      ? 'border-accent-green bg-accent-green/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  data-testid={`day-${i}`}
                >
                  <div className="text-sm font-bold mb-1">{day.name}</div>
                  <div className="text-2xl font-bold mb-2">{day.date}</div>
                  <div className="flex gap-1 justify-center text-xs">
                    🍳🍲🍽️
                  </div>
                  <div className="mt-2 text-lg">
                    {day.completed ? '✅' : '🔄'}
                  </div>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="card-tcf">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-green">{todayDate}</div>
              <div className="text-gray-400 text-sm capitalize">{todayName}</div>
              <div className="text-gray-500 text-xs capitalize">{todayMonth}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl text-chalk mb-1">Comidas de Hoy</h2>
              <p className="text-gray-400 text-sm">
                {onboardingData.mealsPerDay} comidas planificadas
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent-green/50 transition-all"
                data-testid={`meal-${meal.id}`}
              >
                <div className="text-3xl">{getMealIcon(meal.meal)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{getMealTime(meal.meal)}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">
                      {meal.meal}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mt-1">{meal.name}</h3>
                  <p className="text-gray-400 text-sm">⏱️ {meal.time}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-accent-green border-accent-green/50"
                  data-testid={`view-recipe-${meal.id}`}
                >
                  Ver receta
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="card-tcf">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-chalk">🛒 Lista de Compra</h2>
            <span className="text-sm text-gray-400">
              {totalPending} items pendientes
            </span>
          </div>

          {pendingItems.length > 0 ? (
            <>
              <div className="space-y-2 mb-4">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded bg-white/5"
                    data-testid={`shopping-item-${item.id}`}
                  >
                    <span className="w-6 h-6 rounded border border-white/30 flex items-center justify-center text-xs">
                      ○
                    </span>
                    <span className="text-white">{item.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{item.category}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setLocation('/shopping')}
                className="w-full py-3 rounded-xl border border-accent-green text-accent-green hover:bg-accent-green/10 transition-colors"
                data-testid="button-full-list"
              >
                Ver lista completa →
              </button>
            </>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>No hay items en la lista</p>
              <button
                onClick={() => setLocation('/loading')}
                className="mt-2 text-accent-green hover:underline"
              >
                Generar menú para crear lista
              </button>
            </div>
          )}
        </section>

        <button 
          onClick={() => setLocation('/rewards')}
          className="card-tcf bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30 w-full text-left hover:border-orange-500/50 transition-colors"
          data-testid="button-rewards"
        >
          <h2 className="text-xl text-chalk mb-4">🏆 SkinChef Rewards</h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/5">
              <StreakCounter size="sm" />
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</div>
              <div className="text-xs text-gray-400">puntos totales</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <LevelBadge size="sm" showName={false} />
              <div className="text-xs text-gray-400 mt-1">Nivel {level}</div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 flex items-center gap-3">
            <div className="text-2xl">{currentLevel.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{currentLevel.name}</div>
              <div className="h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all" 
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-400">{levelProgress}%</div>
          </div>
        </button>
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
