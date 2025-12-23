import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface DashboardState {
  menu: MenuItem[];
  shoppingList: ShoppingItem[];
  setMenu: (menu: MenuItem[]) => void;
  setShoppingList: (list: ShoppingItem[]) => void;
  toggleShoppingItem: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      menu: [],
      shoppingList: [],
      setMenu: (menu) => set({ menu }),
      setShoppingList: (list) => set({ shoppingList: list }),
      toggleShoppingItem: (id) => set((state) => ({
        shoppingList: state.shoppingList.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      })),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
