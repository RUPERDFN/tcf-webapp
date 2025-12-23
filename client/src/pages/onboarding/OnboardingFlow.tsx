import { useLocation, Route, Switch, Redirect } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import Step1Budget from './Step1Budget';

// Placeholder steps for now
const PlaceholderStep = ({ step, title }: { step: number, title: string }) => {
    const [, setLocation] = useLocation();
    const { nextStep } = useOnboardingStore();
    
    const handleNext = () => {
        nextStep();
        if (step < 8) {
           setLocation(`/onboarding/${step + 1}`);
        } else {
           setLocation('/loading');
        }
    };
    
    return (
        <div className="card-chalk animate-in fade-in">
           <h2 className="text-3xl mb-4 text-accent-green">{title}</h2>
           <p>Step {step} content goes here...</p>
           <div className="flex justify-end mt-6">
              <Button onClick={handleNext}>Siguiente</Button>
           </div>
        </div>
    );
};

// We need to import Button here if we use it in Placeholder
import Button from '../../components/ui/Button';

export default function OnboardingFlow() {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between mb-2 gap-2">
            {[1,2,3,4,5,6,7,8].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  step <= currentStep ? 'bg-accent-green shadow-[0_0_10px_rgba(93,185,168,0.5)]' : 'bg-chalkboard-light'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-chalk-cream font-display text-xl">Paso {currentStep} de 8</p>
        </div>
        
        <Switch>
          <Route path="/onboarding/1" component={Step1Budget} />
          <Route path="/onboarding/2"><PlaceholderStep step={2} title="¿Cuántos coméis?" /></Route>
          <Route path="/onboarding/3"><PlaceholderStep step={3} title="¿Comidas al día?" /></Route>
          <Route path="/onboarding/4"><PlaceholderStep step={4} title="Días a planificar" /></Route>
          <Route path="/onboarding/5"><PlaceholderStep step={5} title="Tipo de dieta" /></Route>
          <Route path="/onboarding/6"><PlaceholderStep step={6} title="Alergias" /></Route>
          <Route path="/onboarding/7"><PlaceholderStep step={7} title="Alimentos que no te gustan" /></Route>
          <Route path="/onboarding/8"><PlaceholderStep step={8} title="Despensa" /></Route>
          
          {/* Default redirect to step 1 */}
          <Route path="/onboarding"><Redirect to="/onboarding/1" /></Route>
        </Switch>
      </div>
    </div>
  );
}
