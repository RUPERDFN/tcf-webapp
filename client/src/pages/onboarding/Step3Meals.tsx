import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';

const mealOptions = [
  { value: 3, label: '3', description: 'Desayuno, Comida, Cena', icon: '🍳🍲🍽️' },
  { value: 4, label: '4', description: '+ Merienda', icon: '🍳🍲🍰🍽️' },
  { value: 5, label: '5', description: '+ Almuerzo', icon: '🍳🥪🍲🍰🍽️' },
];

export default function Step3Meals() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();

  const handleSelect = (value: number) => {
    updateData({ mealsPerDay: value });
  };

  const handleNext = () => {
    if (data.mealsPerDay >= 3 && data.mealsPerDay <= 5) {
      nextStep();
      setLocation('/onboarding/4');
    }
  };

  const handleBack = () => {
    prevStep();
    setLocation('/onboarding/2');
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
        ¿Cuántas comidas harás al día?
      </h2>

      <p className="text-gray-300 text-center mb-6">
        Selecciona el número de comidas que planificaremos
      </p>

      <div className="space-y-4 mb-8">
        {mealOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
              data.mealsPerDay === option.value
                ? 'border-accent-green bg-accent-green/20 scale-[1.02]'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
            data-testid={`button-meals-${option.value}`}
          >
            <div className="text-4xl">{option.icon}</div>
            <div className="flex-1 text-left">
              <div className={`text-3xl font-bold ${
                data.mealsPerDay === option.value ? 'text-accent-green' : 'text-white'
              }`}>
                {option.label} comidas
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {option.description}
              </div>
            </div>
            {data.mealsPerDay === option.value && (
              <div className="text-accent-green text-2xl">✓</div>
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
          disabled={data.mealsPerDay < 3 || data.mealsPerDay > 5}
          className="btn-siguiente px-8"
          data-testid="button-next"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
