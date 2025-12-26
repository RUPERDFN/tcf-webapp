import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DietType = 'omnivora' | 'vegetariana' | 'vegana' | 'pescetariana' | 'sin_gluten';

export interface OnboardingData {
  budgetWeekly: number;
  diners: number;
  mealsPerDay: number;
  daysPerWeek: number;
  dietType: DietType;
  allergies: string[];
  dislikes: string[];
  pantryItems: string[];
}

interface OnboardingStore {
  currentStep: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  isComplete: () => boolean;
  setField: (field: string, value: any) => void;
}

const initialData: OnboardingData = {
  budgetWeekly: 50,
  diners: 2,
  mealsPerDay: 3,
  daysPerWeek: 5,
  dietType: 'omnivora',
  allergies: [],
  dislikes: [],
  pantryItems: [],
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: { ...initialData },

      setStep: (step: number) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 8) 
      })),

      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),

      updateData: (partial: Partial<OnboardingData>) => set((state) => ({
        data: { ...state.data, ...partial }
      })),

      resetOnboarding: () => set({
        currentStep: 1,
        data: { ...initialData },
      }),

      isComplete: () => {
        const { data } = get();
        return (
          data.budgetWeekly >= 20 &&
          data.budgetWeekly <= 200 &&
          data.diners >= 1 &&
          data.diners <= 10 &&
          data.mealsPerDay >= 3 &&
          data.mealsPerDay <= 5 &&
          data.daysPerWeek >= 1 &&
          data.daysPerWeek <= 7 &&
          data.dietType !== undefined
        );
      },

      setField: (field: string, value: any) => set((state) => ({
        data: { ...state.data, [field]: value }
      })),
    }),
    {
      name: 'tcf-onboarding',
    }
  )
);
