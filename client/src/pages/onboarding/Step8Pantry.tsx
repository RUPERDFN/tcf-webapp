import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const pantryCategories = {
  basicos: { name: 'Básicos', icon: '🧂', items: ['aceite', 'sal', 'pimienta', 'azúcar', 'harina', 'especias'] },
  nevera: { name: 'Nevera', icon: '🥛', items: ['leche', 'huevos', 'queso', 'mantequilla', 'yogur', 'nata'] },
  despensa: { name: 'Despensa', icon: '🍚', items: ['arroz', 'pasta', 'legumbres', 'tomate frito', 'atún', 'galletas'] },
  frescos: { name: 'Frescos', icon: '🥬', items: ['cebolla', 'ajo', 'tomate', 'patatas', 'zanahorias', 'limón'] }
};

type InputMode = 'choice' | 'manual' | 'photo';

export default function Step8Pantry() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, setCompleted } = useOnboardingStore();
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<InputMode>('choice');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pantryItems = data.pantryItems || [];

  const allSuggestions = Object.values(pantryCategories).flatMap(c => c.items);
  
  const filteredSuggestions = allSuggestions.filter(
    item => 
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      !pantryItems.includes(item)
  );

  const addItem = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !pantryItems.includes(trimmed)) {
      updateData({ pantryItems: [...pantryItems, trimmed] });
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeItem = (value: string) => {
    updateData({ pantryItems: pantryItems.filter(i => i !== value) });
  };

  const addCategory = (items: string[]) => {
    const newItems = items.filter(i => !pantryItems.includes(i));
    updateData({ pantryItems: [...pantryItems, ...newItems] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addItem(inputValue);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    nextStep();
    setLocation('/loading');
  };

  const handleBack = () => {
    if (mode !== 'choice') {
      setMode('choice');
    } else {
      setLocation('/onboarding/7');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="card-tcf fade-in">
      <div className="text-center mb-8">
        <img 
          src="/logos/logo.png" 
          alt="TheCookFlow" 
          className="w-16 h-auto mx-auto mb-2"
        />
        <h3 className="text-2xl text-chalk">The CookFlow</h3>
      </div>

      <h2 className="text-3xl md:text-4xl text-chalk text-center mb-4">
        ¿Qué tienes ya en casa?
      </h2>

      <p className="text-gray-300 text-center mb-8">
        Así aprovechamos lo que ya tienes (opcional)
      </p>

      {mode === 'choice' && (
        <div className="grid grid-cols-1 gap-4 mb-8">
          <button
            onClick={() => setMode('photo')}
            className="p-6 rounded-xl border-2 border-white/20 bg-white/5 hover:border-accent-green hover:bg-accent-green/10 transition-all text-left flex items-center gap-4"
            data-testid="button-photo-mode"
          >
            <span className="text-4xl">📸</span>
            <div>
              <div className="text-lg font-bold text-white">Subir foto</div>
              <div className="text-gray-400 text-sm">Fotografía tu nevera o despensa</div>
            </div>
          </button>
          
          <button
            onClick={() => setMode('manual')}
            className="p-6 rounded-xl border-2 border-white/20 bg-white/5 hover:border-accent-green hover:bg-accent-green/10 transition-all text-left flex items-center gap-4"
            data-testid="button-manual-mode"
          >
            <span className="text-4xl">📝</span>
            <div>
              <div className="text-lg font-bold text-white">Añadir lista</div>
              <div className="text-gray-400 text-sm">Escribe los alimentos manualmente</div>
            </div>
          </button>

          <button
            onClick={handleComplete}
            className="p-6 rounded-xl border-2 border-white/20 bg-white/5 hover:border-white/40 transition-all text-center"
            data-testid="button-skip"
          >
            <div className="text-gray-400">Saltar este paso →</div>
          </button>
        </div>
      )}

      {mode === 'photo' && (
        <div className="mb-8">
          <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center mb-4">
            <span className="text-6xl mb-4 block">📷</span>
            <p className="text-gray-300 mb-4">Arrastra una foto o haz clic para seleccionar</p>
            <Button variant="outline" data-testid="button-upload">
              Seleccionar foto
            </Button>
            <p className="text-gray-500 text-sm mt-4">
              (Función disponible próximamente)
            </p>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <>
          <div className="relative mb-6">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un alimento..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              data-testid="input-pantry"
            />
            
            {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-white/20 rounded-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addItem(suggestion)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors capitalize"
                    data-testid={`suggestion-${suggestion}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Añadir por categoría:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(pantryCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => addCategory(category.items)}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-accent-green hover:bg-accent-green/10 transition-all text-left"
                  data-testid={`category-${key}`}
                >
                  <span className="text-xl mr-2">{category.icon}</span>
                  <span className="text-white text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {pantryItems.length > 0 && (
        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">Tu despensa ({pantryItems.length} items):</p>
          <div className="flex flex-wrap gap-2">
            {pantryItems.map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full bg-accent-green/20 text-accent-green text-sm flex items-center gap-2 capitalize"
              >
                ✓ {item}
                <button
                  onClick={() => removeItem(item)}
                  className="hover:text-white font-bold"
                  data-testid={`remove-${item}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="px-8"
          data-testid="button-back"
        >
          Atrás
        </Button>
        {(mode === 'manual' || mode === 'photo') && (
          <button
            onClick={handleComplete}
            className="btn-siguiente px-8"
            data-testid="button-complete"
          >
            ¡Crear mi menú! 🍽️
          </button>
        )}
      </div>
    </div>
  );
}
