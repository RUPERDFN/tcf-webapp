import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const dayFullNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function Step4Days() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();

  const handleSliderChange = (value: number[]) => {
    updateData({ daysPerWeek: value[0] });
  };

  const handleDayClick = (day: number) => {
    updateData({ daysPerWeek: day });
  };

  const handleNext = () => {
    if (data.daysPerWeek >= 1 && data.daysPerWeek <= 7) {
      nextStep();
      setLocation('/onboarding/5');
    }
  };

  const handleBack = () => {
    prevStep();
    setLocation('/onboarding/3');
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
        ¿Cuántos días de la semana?
      </h2>

      <p className="text-gray-300 text-center mb-6">
        Planificaremos menús para estos días
      </p>

      <div className="mb-8">
        <div className="text-center mb-6">
          <span className="text-6xl font-bold text-accent-green">{data.daysPerWeek}</span>
          <span className="text-2xl text-gray-400 ml-2">días</span>
        </div>

        <div className="px-4 mb-8">
          <Slider
            value={[data.daysPerWeek]}
            onValueChange={handleSliderChange}
            min={1}
            max={7}
            step={1}
            className="w-full"
            data-testid="slider-days"
          />
          <div className="flex justify-between mt-2 text-gray-400 text-sm">
            <span>1</span>
            <span>7</span>
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {dayNames.map((name, index) => {
            const dayNum = index + 1;
            const isSelected = dayNum <= data.daysPerWeek;
            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 ${
                  isSelected
                    ? 'bg-accent-green border-accent-green text-white scale-110'
                    : 'bg-transparent border-white/30 text-gray-400 hover:border-white/50'
                }`}
                data-testid={`button-day-${dayNum}`}
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-4 text-gray-400">
          {data.daysPerWeek === 7 
            ? 'Toda la semana' 
            : `${dayFullNames.slice(0, data.daysPerWeek).join(', ')}`
          }
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📅</div>
        <p className="text-gray-400 text-sm">
          {data.daysPerWeek === 5 && '¡Perfecto para la semana laboral!'}
          {data.daysPerWeek === 7 && '¡Planificación completa!'}
          {data.daysPerWeek < 5 && 'Ideal para empezar poco a poco'}
          {data.daysPerWeek === 6 && '¡Casi toda la semana!'}
        </p>
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
          className="btn-siguiente px-8"
          data-testid="button-next"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
