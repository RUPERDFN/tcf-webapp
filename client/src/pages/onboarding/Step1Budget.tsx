import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';

export default function Step1Budget() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep } = useOnboardingStore();

  const handleNext = () => {
    if (data.budgetWeekly >= 20 && data.budgetWeekly <= 200) {
      nextStep();
      setLocation('/onboarding/2');
    }
  };

  return (
    <div className="card-tcf fade-in">
      <div className="text-center mb-8">
        <img 
          src="/logos/logo.png" 
          alt="TheCookFlow" 
          className="w-16 h-auto mx-auto mb-2"
        />
        <h3 className="text-2xl font-chalk">The CookFlow</h3>
      </div>

      <h2 className="text-3xl md:text-4xl font-chalk text-center mb-8">
        Presupuesto semanal
      </h2>

      <p className="text-gray-300 text-center mb-6">
        ¿Cuánto quieres gastar en comida esta semana?
      </p>

      <div className="mb-8">
        <input
          type="number"
          placeholder="Ej: 50€"
          value={data.budgetWeekly || ''}
          onChange={(e) => updateData({ budgetWeekly: parseInt(e.target.value) || 0 })}
          min={20}
          max={200}
          className="input-tcf text-center font-bold text-3xl"
          data-testid="input-budget"
        />
        <p className="text-gray-400 text-sm mt-2 text-center">
          Entre 20€ y 200€ por semana
        </p>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleNext} 
          disabled={data.budgetWeekly < 20 || data.budgetWeekly > 200}
          className="btn-siguiente w-full"
          data-testid="button-next"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
