import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import api from '@/lib/api';
import { ChalkButton } from '@/components/chalk-button';
import { ChalkCard } from '@/components/chalk-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    budget: 50,
    people: 1,
    mealsPerDay: '2',
    daysToPlan: '5',
    allergies: [] as string[],
    diet: 'omnivore',
    dislikes: [] as string[],
    pantry: ''
  });
  const [allergyInput, setAllergyInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');
  const [, setLocation] = useLocation();
  const updateOnboarding = useStore((state) => state.updateOnboarding);

  const totalSteps = 8;

  const nextStep = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finish
      updateOnboarding(data);
      await api.put('/profile', data);
      setLocation('/loading');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const addChip = (field: 'allergies' | 'dislikes', value: string) => {
    if (!value.trim()) return;
    if (!data[field].includes(value)) {
      setData({ ...data, [field]: [...data[field], value] });
    }
    if (field === 'allergies') setAllergyInput('');
    else setDislikeInput('');
  };

  const removeChip = (field: 'allergies' | 'dislikes', value: string) => {
    setData({ ...data, [field]: data[field].filter(i => i !== value) });
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label className="text-xl">What is your weekly budget?</Label>
            <div className="text-4xl font-display text-primary text-center">€{data.budget}</div>
            <Slider 
              value={[data.budget]} 
              onValueChange={(v) => setData({...data, budget: v[0]})} 
              max={300} 
              step={5} 
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label className="text-xl">How many people are eating?</Label>
            <div className="flex gap-4 justify-center">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setData({...data, people: num})}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all
                    ${data.people === num ? 'bg-primary border-primary text-black scale-110' : 'border-white/20 hover:border-white/50'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label className="text-xl">How many meals per day?</Label>
            <Select value={data.mealsPerDay} onValueChange={(v) => setData({...data, mealsPerDay: v})}>
              <SelectTrigger className="bg-transparent border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 (Dinner only)</SelectItem>
                <SelectItem value="2">2 (Lunch + Dinner)</SelectItem>
                <SelectItem value="3">3 (Breakfast + Lunch + Dinner)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label className="text-xl">How many days to plan?</Label>
             <div className="flex gap-4 justify-center">
              {['3', '5', '7'].map(d => (
                <button
                  key={d}
                  onClick={() => setData({...data, daysToPlan: d})}
                  className={`px-6 py-3 rounded-xl border-2 transition-all
                    ${data.daysToPlan === d ? 'bg-accent border-accent text-black' : 'border-white/20 hover:border-white/50'}`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Label className="text-xl">Any allergies or intolerances?</Label>
            <div className="flex gap-2">
              <Input 
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addChip('allergies', allergyInput)}
                placeholder="Type and press Enter (e.g., Peanuts)"
                className="bg-transparent border-white/20"
              />
              <ChalkButton onClick={() => addChip('allergies', allergyInput)} type="button" variant="secondary" className="px-4 py-2">Add</ChalkButton>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.allergies.map(a => (
                <Badge key={a} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
                  {a} <X className="w-3 h-3 cursor-pointer" onClick={() => removeChip('allergies', a)} />
                </Badge>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <Label className="text-xl">Dietary preference?</Label>
             <Select value={data.diet} onValueChange={(v) => setData({...data, diet: v})}>
              <SelectTrigger className="bg-transparent border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore (Everything)</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <Label className="text-xl">Any ingredients you dislike?</Label>
             <div className="flex gap-2">
              <Input 
                value={dislikeInput}
                onChange={(e) => setDislikeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addChip('dislikes', dislikeInput)}
                placeholder="Type and press Enter (e.g., Cilantro)"
                className="bg-transparent border-white/20"
              />
              <ChalkButton onClick={() => addChip('dislikes', dislikeInput)} type="button" variant="secondary" className="px-4 py-2">Add</ChalkButton>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.dislikes.map(d => (
                <Badge key={d} variant="destructive" className="px-3 py-1 text-sm flex items-center gap-2">
                  {d} <X className="w-3 h-3 cursor-pointer" onClick={() => removeChip('dislikes', d)} />
                </Badge>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <Label className="text-xl">What's already in your pantry? (Optional)</Label>
            <Textarea 
              value={data.pantry}
              onChange={(e) => setData({...data, pantry: e.target.value})}
              placeholder="e.g., Rice, Pasta, Canned beans..."
              className="bg-transparent border-white/20 h-32"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout hideNav>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto">
        <div className="w-full mb-8">
           <div className="h-2 bg-white/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-500 ease-out"
               style={{ width: `${(step / totalSteps) * 100}%` }}
             />
           </div>
           <div className="text-right text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</div>
        </div>

        <ChalkCard className="w-full min-h-[400px] flex flex-col justify-between" title="Setup Your Kitchen">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 py-4"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
            <ChalkButton 
              variant="outline" 
              onClick={prevStep} 
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </ChalkButton>
            <ChalkButton onClick={nextStep}>
              {step === totalSteps ? 'Finish' : 'Next'} <ArrowRight className="ml-2 w-4 h-4" />
            </ChalkButton>
          </div>
        </ChalkCard>
      </div>
    </Layout>
  );
}
