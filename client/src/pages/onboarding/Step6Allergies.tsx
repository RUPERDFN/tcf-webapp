import { useState } from 'react';
import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const allergyOptions = [
  { value: 'gluten', name: 'Gluten', icon: '🌾' },
  { value: 'lactosa', name: 'Lactosa', icon: '🥛' },
  { value: 'frutos_secos', name: 'Frutos secos', icon: '🥜' },
  { value: 'mariscos', name: 'Mariscos', icon: '🦐' },
  { value: 'huevos', name: 'Huevos', icon: '🥚' },
  { value: 'soja', name: 'Soja', icon: '🫘' },
  { value: 'pescado', name: 'Pescado', icon: '🐟' },
  { value: 'apio', name: 'Apio', icon: '🥬' },
];

export default function Step6Allergies() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const [otherAllergy, setOtherAllergy] = useState('');

  const toggleAllergy = (value: string) => {
    const current = data.allergies || [];
    if (current.includes(value)) {
      updateData({ allergies: current.filter(a => a !== value) });
    } else {
      updateData({ allergies: [...current, value] });
    }
  };

  const addOtherAllergy = () => {
    if (otherAllergy.trim()) {
      const current = data.allergies || [];
      if (!current.includes(otherAllergy.trim().toLowerCase())) {
        updateData({ allergies: [...current, otherAllergy.trim().toLowerCase()] });
      }
      setOtherAllergy('');
    }
  };

  const handleNext = () => {
    nextStep();
    setLocation('/onboarding/7');
  };

  const handleBack = () => {
    prevStep();
    setLocation('/onboarding/5');
  };

  const isSelected = (value: string) => (data.allergies || []).includes(value);

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
        ¿Tienes alergias alimentarias?
      </h2>

      <p className="text-gray-300 text-center mb-8">
        Selecciona todas las que apliquen (puedes no seleccionar ninguna)
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {allergyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleAllergy(option.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
              isSelected(option.value)
                ? 'border-red-500 bg-red-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
            data-testid={`button-allergy-${option.value}`}
          >
            <div className="text-2xl mb-1 relative">
              {option.icon}
              {isSelected(option.value) && (
                <span className="absolute -top-1 -right-3 text-red-500 text-lg">❌</span>
              )}
            </div>
            <div className={`text-sm font-medium ${
              isSelected(option.value) ? 'text-red-400' : 'text-white'
            }`}>
              {option.name}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="text-gray-300 text-sm mb-2 block">Otras alergias:</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={otherAllergy}
            onChange={(e) => setOtherAllergy(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addOtherAllergy()}
            placeholder="Escribe y pulsa Enter o Añadir"
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            data-testid="input-other-allergy"
          />
          <Button
            onClick={addOtherAllergy}
            variant="outline"
            className="px-4"
            data-testid="button-add-allergy"
          >
            Añadir
          </Button>
        </div>
      </div>

      {(data.allergies || []).length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">Alergias seleccionadas:</p>
          <div className="flex flex-wrap gap-2">
            {(data.allergies || []).map((allergy) => (
              <span
                key={allergy}
                className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm flex items-center gap-1"
              >
                ❌ {allergy}
                <button
                  onClick={() => toggleAllergy(allergy)}
                  className="ml-1 hover:text-red-300"
                  data-testid={`button-remove-${allergy}`}
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
        <button
          onClick={handleNext}
          className="btn-siguiente px-8"
          data-testid="button-next"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
