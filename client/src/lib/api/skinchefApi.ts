import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SKINCHEF_URL = import.meta.env.VITE_SKINCHEF_URL || 'http://localhost:8000';

export interface ProfileData {
  budget_eur_week: number;
  diners: number;
  meals_per_day: number;
  days: number;
  allergies: string[];
  diet: string;
  dislikes: string[];
  pantry_text: string;
}

export interface GenerateMenuRequest {
  user_id: string;
  profile: ProfileData;
  days: number;
}

export interface SwapMealRequest {
  user_id: string;
  profile: ProfileData;
  menu: any;
  day_index: number;
  meal_key: string;
  constraints?: string;
}

export interface SubstitutionsRequest {
  user_id: string;
  profile: ProfileData;
  ingredient: string;
  reason: string;
}

export async function generateMenu(userId: string, profile: ProfileData, days: number) {
  const response = await fetch(`${SKINCHEF_URL}/menu/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, profile, days })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error generando menú');
  }
  return response.json();
}

export async function swapMeal(
  userId: string, 
  profile: ProfileData, 
  menu: any, 
  dayIndex: number, 
  mealKey: string, 
  constraints?: string
) {
  const response = await fetch(`${SKINCHEF_URL}/menu/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_id: userId, 
      profile, 
      menu, 
      day_index: dayIndex, 
      meal_key: mealKey, 
      constraints 
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error intercambiando comida');
  }
  return response.json();
}

export async function getSubstitutions(
  userId: string, 
  profile: ProfileData, 
  ingredient: string, 
  reason: string
) {
  const response = await fetch(`${SKINCHEF_URL}/substitutions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, profile, ingredient, reason })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error obteniendo sustitutos');
  }
  return response.json();
}

export interface MenuResponse {
  menu: {
    days: Array<{
      day: string;
      meals: Record<string, { name: string; time: string; ingredients: string[] }>;
    }>;
  };
  shopping_list: Array<{ name: string; quantity: string; category: string }>;
}

export function useGenerateMenu() {
  const queryClient = useQueryClient();

  return useMutation<MenuResponse, Error, { userId: string; profile: ProfileData; days: number }>({
    mutationFn: ({ userId, profile, days }) => generateMenu(userId, profile, days),
    onMutate: () => {
      toast.loading('Generando tu menú personalizado...', { id: 'generate-menu' });
    },
    onSuccess: (data) => {
      toast.success('¡Menú generado con éxito!', { id: 'generate-menu' });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al generar el menú', { id: 'generate-menu' });
    },
    onSettled: () => {
      toast.dismiss('generate-menu');
    },
  });
}

export interface SwapMealResponse {
  new_meal: { name: string; time: string; ingredients: string[] };
}

export function useSwapMeal() {
  const queryClient = useQueryClient();

  return useMutation<SwapMealResponse, Error, { 
    userId: string; 
    profile: ProfileData; 
    menu: any; 
    dayIndex: number; 
    mealKey: string; 
    constraints?: string;
  }>({
    mutationFn: ({ userId, profile, menu, dayIndex, mealKey, constraints }) => 
      swapMeal(userId, profile, menu, dayIndex, mealKey, constraints),
    onMutate: () => {
      toast.loading('Buscando alternativa...', { id: 'swap-meal' });
    },
    onSuccess: (data) => {
      toast.success('¡Comida cambiada!', { id: 'swap-meal' });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cambiar la comida', { id: 'swap-meal' });
    },
    onSettled: () => {
      toast.dismiss('swap-meal');
    },
  });
}

export interface SubstitutionsResponse {
  substitutes: Array<{ name: string; reason: string; healthier: boolean }>;
}

export function useSubstitutions() {
  return useMutation<SubstitutionsResponse, Error, { 
    userId: string; 
    profile: ProfileData; 
    ingredient: string; 
    reason: string;
  }>({
    mutationFn: ({ userId, profile, ingredient, reason }) => 
      getSubstitutions(userId, profile, ingredient, reason),
    onMutate: () => {
      toast.loading('Buscando sustitutos...', { id: 'substitutions' });
    },
    onSuccess: (data) => {
      toast.success('Sustitutos encontrados', { id: 'substitutions' });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al buscar sustitutos', { id: 'substitutions' });
    },
    onSettled: () => {
      toast.dismiss('substitutions');
    },
  });
}
