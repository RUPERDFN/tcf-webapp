import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentStep: number;
  budget_eur_week: number;
  diners: number;
  meals_per_day: number;
  days: number;
  diet_type: string;
  allergies: string[];
  favorite_foods: string[];
  disliked_foods: string[];
  pantry_items: string;
  setField: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      budget_eur_week: 50,
      diners: 2,
      meals_per_day: 2,
      days: 5,
      diet_type: 'omnivora',
      allergies: [],
      favorite_foods: [],
      disliked_foods: [],
      pantry_items: '',
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
      reset: () => set({
        currentStep: 1,
        budget_eur_week: 50,
        diners: 2,
        meals_per_day: 2,
        days: 5,
        diet_type: 'omnivora',
        allergies: [],
        favorite_foods: [],
        disliked_foods: [],
        pantry_items: '',
      }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
