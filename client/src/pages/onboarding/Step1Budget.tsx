import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Step1Budget() {
  const [, setLocation] = useLocation();
  const { budget_eur_week, setField, nextStep } = useOnboardingStore();

  const handleNext = () => {
    if (budget_eur_week >= 30 && budget_eur_week <= 500) {
      nextStep();
      setLocation('/onboarding/2');
    }
  };

  return (
    <div className="card-chalk animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl mb-4 text-accent-yellow">¿Cuál es tu presupuesto semanal?</h2>
      <p className="text-chalk-cream mb-6 text-xl">
        Indica cuánto quieres gastar en comida cada semana (30-500€)
      </p>
      
      <div className="mb-8">
         <div className="text-6xl font-display text-center mb-4 text-accent-green">
            {budget_eur_week}€
         </div>
         <input 
           type="range" 
           min="30" 
           max="500" 
           step="5"
           value={budget_eur_week}
           onChange={(e) => setField('budget_eur_week', parseInt(e.target.value))}
           className="w-full h-2 bg-chalkboard-light rounded-lg appearance-none cursor-pointer accent-accent-green"
         />
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
