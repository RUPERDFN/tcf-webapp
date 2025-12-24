import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore'; 

export default function Step1Budget() {
  const [, setLocation] = useLocation();
  const { budget_eur_week, setField } = useOnboardingStore();

  const handleNext = () => {
    if (budget_eur_week >= 30 && budget_eur_week <= 500) {
      setLocation('/onboarding/2');
    }
  };

  return (
    <div className="card-tcf fade-in">
      {/* Logo real pequeño */}
      <div className="text-center mb-8">
        <img 
          src="/logos/logo.png" 
          alt="TheCookFlow" 
          className="w-16 h-auto mx-auto mb-2"
        />
        <h3 className="text-2xl font-chalk">The CookFlow</h3>
      </div>

      {/* Pregunta */}
      <h2 className="text-3xl md:text-4xl font-chalk text-center mb-8">
        Presupuesto semanal
      </h2>

      <p className="text-gray-300 text-center mb-6">
        ¿Cuánto quieres gastar en comida esta semana?
      </p>

      {/* Input */}
      <div className="mb-8">
        <input
          type="number"
          placeholder="Ej: 50€"
          value={budget_eur_week || ''}
          onChange={(e) => setField('budget_eur_week', parseInt(e.target.value) || 0)}
          min={30}
          max={500}
          className="input-tcf text-center font-bold text-3xl"
        />
        <p className="text-gray-400 text-sm mt-2 text-center">
          Entre 30€ y 500€ por semana
        </p>
      </div>

      {/* Botón */}
      <div className="flex justify-center">
        <button 
          onClick={handleNext} 
          disabled={budget_eur_week < 30 || budget_eur_week > 500}
          className="btn-siguiente w-full"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
