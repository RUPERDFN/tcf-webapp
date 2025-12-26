import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/lib/stores/authStore';
import { useOnboardingStore, type OnboardingData, type DietType } from '@/lib/stores/onboardingStore';
import { useGamificationStore } from '@/lib/stores/gamificationStore';
import { profileAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { LevelBadge } from '@/components/gamification';
import { X, ChevronRight, Bell, Globe, Moon, Download, Trash2, Shield, FileText, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const DIETS = [
  { value: 'omnivora', label: 'Omnívora', icon: '🍖' },
  { value: 'vegetariana', label: 'Vegetariana', icon: '🥬' },
  { value: 'vegana', label: 'Vegana', icon: '🌱' },
  { value: 'pescetariana', label: 'Pescetariana', icon: '🐟' },
  { value: 'sin_gluten', label: 'Sin Gluten', icon: '🌾' },
];

const COMMON_ALLERGIES = ['Gluten', 'Lactosa', 'Frutos secos', 'Mariscos', 'Huevo', 'Soja'];

function useDebounce(callback: () => void, delay: number) {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  return useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data, updateData } = useOnboardingStore();
  const { points, level, streak, getLevel, badges } = useGamificationStore();
  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState('profile');
  
  const [formData, setFormData] = useState<OnboardingData>(data);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('es');

  const currentLevel = getLevel();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const saveProfile = useCallback(async () => {
    try {
      await profileAPI.update({
        budget_eur_week: formData.budgetWeekly,
        diners: formData.diners,
        meals_per_day: formData.mealsPerDay,
        days: formData.daysPerWeek,
        diet_type: formData.dietType,
        allergies: formData.allergies,
        disliked_foods: formData.dislikes,
        pantry_items: formData.pantryItems.join(', '),
      });
      updateData(formData);
      toast.success('Guardado', { duration: 1500 });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar');
    }
  }, [formData, updateData]);

  const debouncedSave = useDebounce(saveProfile, 1000);

  const handleFormChange = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    debouncedSave();
  };

  const toggleAllergy = (allergy: string) => {
    const newAllergies = formData.allergies.includes(allergy)
      ? formData.allergies.filter(a => a !== allergy)
      : [...formData.allergies, allergy];
    handleFormChange({ allergies: newAllergies });
  };

  const removeDislike = (item: string) => {
    handleFormChange({ dislikes: formData.dislikes.filter(d => d !== item) });
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleExportData = () => {
    const exportData = {
      user: { email: user?.email },
      preferences: formData,
      gamification: { points, level, streak, badges: unlockedBadges }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thecookflow-data.json';
    a.click();
    toast.success('Datos exportados correctamente');
  };

  const handleDeleteAccount = () => {
    toast.error('Para eliminar tu cuenta, contacta con soporte@thecookflow.com');
  };

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
            <h1 className="text-xl text-chalk">Mi Perfil</h1>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm"
              data-testid="button-logout"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        <section className="card-tcf">
          <div className="flex items-center gap-4">
            <button 
              className="relative group"
              data-testid="button-avatar"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-green to-teal-600 flex items-center justify-center text-3xl">
                👨‍🍳
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-xs">Editar</span>
              </div>
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white" data-testid="text-username">
                {user?.email?.split('@')[0] || 'Chef'}
              </h2>
              <p className="text-sm text-gray-400" data-testid="text-email">
                {user?.email || 'chef@example.com'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <LevelBadge size="sm" showName={true} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Miembro desde: Diciembre 2024</p>
            </div>
          </div>
        </section>

        <section className="card-tcf">
          <h2 className="text-lg text-chalk mb-4">🥗 Preferencias Alimentarias</h2>
          
          <div className="space-y-5">
            <div>
              <Label className="text-sm text-gray-400 mb-2 block">Tipo de Dieta</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DIETS.map(diet => (
                  <button
                    key={diet.value}
                    onClick={() => handleFormChange({ dietType: diet.value as DietType })}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.dietType === diet.value
                        ? 'border-accent-green bg-accent-green/20'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                    data-testid={`diet-${diet.value}`}
                  >
                    <span className="text-xl mr-2">{diet.icon}</span>
                    <span className="text-sm">{diet.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-400 mb-2 block">Alergias</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map(allergy => (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      formData.allergies.includes(allergy)
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40'
                    }`}
                    data-testid={`allergy-${allergy}`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-400 mb-2 block">Alimentos no deseados</Label>
              <div className="flex flex-wrap gap-2">
                {formData.dislikes?.length > 0 ? (
                  formData.dislikes.map(item => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full text-sm bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1"
                    >
                      {item}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-white" 
                        onClick={() => removeDislike(item)}
                      />
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Ninguno configurado</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm text-gray-400">Presupuesto semanal</Label>
                <span className="text-accent-green font-bold">{formData.budgetWeekly}€</span>
              </div>
              <Slider
                value={[formData.budgetWeekly || 50]}
                onValueChange={([value]) => handleFormChange({ budgetWeekly: value })}
                min={20}
                max={200}
                step={5}
                className="py-2"
                data-testid="slider-budget"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>20€</span>
                <span>200€</span>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-400 mb-2 block">Comensales</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => handleFormChange({ diners: num })}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.diners === num
                        ? 'border-accent-green bg-accent-green text-white'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    data-testid={`diners-${num}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card-tcf" data-testid="section-stats">
          <h2 className="text-lg text-chalk mb-4">📊 Estadísticas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 text-center" data-testid="stat-menus">
              <div className="text-2xl font-bold text-accent-green">12</div>
              <div className="text-xs text-gray-400">Menús generados</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-center" data-testid="stat-recipes">
              <div className="text-2xl font-bold text-yellow-400">87</div>
              <div className="text-xs text-gray-400">Recetas completadas</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-center" data-testid="stat-savings">
              <div className="text-2xl font-bold text-green-400">~120€</div>
              <div className="text-xs text-gray-400">Dinero ahorrado</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-center" data-testid="stat-points">
              <div className="text-2xl font-bold text-orange-400">{points.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Puntos totales</div>
            </div>
          </div>
        </section>

        <section className="card-tcf">
          <h2 className="text-lg text-chalk mb-4">⭐ Suscripción</h2>
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-white">Plan Gratuito</div>
                <div className="text-sm text-gray-400">Funciones básicas</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-gray-600 text-xs">Activo</span>
            </div>
            <ul className="text-sm text-gray-400 space-y-1 mb-4">
              <li>✓ Menú semanal personalizado</li>
              <li>✓ Lista de compras automática</li>
              <li>✓ 3 intercambios de comida/semana</li>
            </ul>
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity"
              data-testid="button-upgrade"
            >
              Mejorar a Premium 🚀
            </button>
          </div>
        </section>

        <section className="card-tcf">
          <h2 className="text-lg text-chalk mb-4">⚙️ Configuración</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span>Notificaciones</span>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5" data-testid="setting-language">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <span>Idioma</span>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 bg-transparent border-white/20" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span>Tema oscuro</span>
              </div>
              <Switch checked={true} disabled data-testid="switch-theme" />
            </div>

            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              data-testid="button-export"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-400" />
                <span>Exportar mis datos</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
              data-testid="button-delete"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                <span>Eliminar cuenta</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="card-tcf" data-testid="section-legal">
          <h2 className="text-lg text-chalk mb-4">📜 Legal</h2>
          <div className="space-y-2">
            <button 
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              data-testid="button-privacy"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span>Política de privacidad</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              data-testid="button-terms"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span>Términos de uso</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              data-testid="button-contact"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>Contacto</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>
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
