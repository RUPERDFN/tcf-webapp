import { useLocation } from 'wouter';
import { useOnboardingStore, type DietType } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';

const dietOptions: { value: DietType; name: string; description: string; icon: string }[] = [
  { 
    value: 'omnivora', 
    name: 'Omnívora', 
    description: 'Come de todo',
    icon: '🥩🥬🐟'
  },
  { 
    value: 'vegetariana', 
    name: 'Vegetariana', 
    description: 'Sin carne ni pescado',
    icon: '🥗🥕🫘'
  },
  { 
    value: 'vegana', 
    name: 'Vegana', 
    description: 'Sin productos animales',
    icon: '🌱🥦🍎'
  },
  { 
    value: 'pescetariana', 
    name: 'Pescetariana', 
    description: 'Vegetariana + pescado',
    icon: '🐟🥬🍅'
  },
  { 
    value: 'sin_gluten', 
    name: 'Sin Gluten', 
    description: 'Apta para celíacos',
    icon: '🚫🌾✓'
  },
];

export default function Step5Diet() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();

  const handleSelect = (value: DietType) => {
    updateData({ dietType: value });
  };

  const handleNext = () => {
    if (data.dietType) {
      nextStep();
      setLocation('/onboarding/6');
    }
  };

  const handleBack = () => {
    prevStep();
    setLocation('/onboarding/4');
  };

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

      <h2 className="text-3xl md:text-4xl text-chalk text-center mb-8">
        ¿Qué tipo de dieta prefieres?
      </h2>

      <p className="text-gray-300 text-center mb-6">
        Adaptaremos todas las recetas a tu alimentación
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {dietOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
              data.dietType === option.value
                ? 'border-accent-green bg-accent-green/20 scale-[1.02]'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            } ${option.value === 'sin_gluten' ? 'col-span-2' : ''}`}
            data-testid={`button-diet-${option.value}`}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <div className={`text-lg font-bold ${
              data.dietType === option.value ? 'text-accent-green' : 'text-white'
            }`}>
              {option.name}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              {option.description}
            </div>
            {data.dietType === option.value && (
              <div className="text-accent-green text-xl mt-2">✓</div>
            )}
          </button>
        ))}
      </div>

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
          disabled={!data.dietType}
          className="btn-siguiente px-8"
          data-testid="button-next"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
