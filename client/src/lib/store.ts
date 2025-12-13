import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'trial' | 'inactive';
}

export interface MenuItem {
  id: string;
  day: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner';
  recipeName: string;
  description: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

interface AppState {
  user: User | null;
  menu: MenuItem[];
  shoppingList: ShoppingItem[];
  onboardingData: any;
  isAuthenticated: boolean;
  
  login: (user: User) => void;
  logout: () => void;
  updateOnboarding: (data: any) => void;
  setMenu: (menu: MenuItem[]) => void;
  setShoppingList: (list: ShoppingItem[]) => void;
  toggleShoppingItem: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      menu: [],
      shoppingList: [],
      onboardingData: {},

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, menu: [], shoppingList: [] }),
      updateOnboarding: (data) => set((state) => ({ onboardingData: { ...state.onboardingData, ...data } })),
      setMenu: (menu) => set({ menu }),
      setShoppingList: (list) => set({ shoppingList: list }),
      toggleShoppingItem: (id) => set((state) => ({
        shoppingList: state.shoppingList.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      })),
    }),
    {
      name: 'thecookflow-storage',
    }
  )
);
