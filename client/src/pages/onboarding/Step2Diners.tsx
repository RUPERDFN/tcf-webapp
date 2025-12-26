import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';

export default function Step2Diners() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();

  const handleNext = () => {
    if (data.diners >= 1 && data.diners <= 10) {
      nextStep();
      setLocation('/onboarding/3');
    }
  };

  const handleBack = () => {
    prevStep();
    setLocation('/onboarding/1');
  };

  return (
    <div className="card-tcf fade-in">
      <div className="text-center mb-8">
        <img src="/logos/logo.png" alt="TheCookFlow" className="w-16 h-16 mx-auto mb-2" />
        <h3 className="text-2xl font-chalk">The CookFlow</h3>
      </div>

      <h2 className="text-3xl md:text-4xl font-chalk text-center mb-8">
        Número de comensales
      </h2>

      <p className="text-gray-300 text-center mb-6">
        ¿Para cuántas personas cocinas?
      </p>

      <div className="mb-8">
        <div className="flex justify-center gap-4 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => updateData({ diners: num })}
              className={`number-selector ${data.diners === num ? 'selected' : ''}`}
              data-testid={`button-diners-${num}`}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-4 text-center">
          También puedes escribir un número (máx. 10)
        </p>
        <input
          type="number"
          className="input-tcf mt-2 text-center font-bold"
          placeholder="Ej: 4"
          value={data.diners || ''}
          onChange={(e) => updateData({ diners: parseInt(e.target.value) || 0 })}
          min={1}
          max={10}
          data-testid="input-diners"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} data-testid="button-back">
          Atrás
        </Button>
        <Button 
          onClick={handleNext}
          disabled={data.diners < 1 || data.diners > 10}
          data-testid="button-next"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
