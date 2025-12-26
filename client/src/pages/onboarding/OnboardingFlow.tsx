import { Switch, Route, Redirect } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import Step1Budget from './Step1Budget';
import Step2Diners from './Step2Diners';
import Step3Meals from './Step3Meals';
import Step4Days from './Step4Days';
import Step5Diet from './Step5Diet';
import Step6Allergies from './Step6Allergies';
import Step7Dislikes from './Step7Dislikes';
import Step8Pantry from './Step8Pantry';

const PlaceholderStep = ({ step, title }: { step: number, title: string }) => {
    return <div className="text-center p-10 card-tcf"><h2 className="text-2xl">{title}</h2></div>;
};

export default function OnboardingFlow() {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  
  const progressPercent = (currentStep / 8) * 100;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8 fade-in">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-center text-white mt-3 font-semibold">
            Paso {currentStep} de 8
          </p>
        </div>
        
        {/* Routes */}
        <Switch>
          <Route path="/onboarding/1" component={Step1Budget} />
          <Route path="/onboarding/2" component={Step2Diners} />
          <Route path="/onboarding/3" component={Step3Meals} />
          <Route path="/onboarding/4" component={Step4Days} />
          <Route path="/onboarding/5" component={Step5Diet} />
          <Route path="/onboarding/6" component={Step6Allergies} />
          <Route path="/onboarding/7" component={Step7Dislikes} />
          <Route path="/onboarding/8" component={Step8Pantry} />
          <Route path="/onboarding/:rest*"><Redirect to="/onboarding/1" /></Route>
        </Switch>
      </div>
    </div>
  );
}
