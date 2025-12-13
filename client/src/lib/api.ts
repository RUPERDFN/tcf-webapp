import axios from 'axios';
import { MenuItem, ShoppingItem } from './store';

// Mock API setup
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Interceptor to mock responses
api.interceptors.request.use(async (config) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  // Mock successful responses for specific endpoints if backend is unreachable
  const { config } = error;
  
  if (config.url?.includes('/login') && config.method === 'post') {
    return {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Chef User',
          email: 'chef@example.com',
          subscriptionStatus: 'trial' // or 'active', 'inactive'
        }
      }
    };
  }

  if (config.url?.includes('/profile') && config.method === 'put') {
    return { data: { success: true } };
  }

  if (config.url?.includes('/menu/generate')) { // Mock Chef API
    return { data: { success: true } };
  }
  
  if (config.url?.includes('/api/menus') && config.method === 'post') {
     return { data: { success: true } };
  }
  
  if (config.url?.includes('/api/shopping') && config.method === 'post') {
     return { data: { success: true } };
  }

  if (config.url?.includes('/menus/latest')) {
    const mockMenu: MenuItem[] = [
      { id: '1', day: 'Monday', meal: 'Lunch', recipeName: 'Quinoa Salad', description: 'Fresh veggies with lemon dressing' },
      { id: '2', day: 'Monday', meal: 'Dinner', recipeName: 'Grilled Salmon', description: 'With asparagus and wild rice' },
      { id: '3', day: 'Tuesday', meal: 'Lunch', recipeName: 'Turkey Wrap', description: 'Whole wheat wrap with avocado' },
      { id: '4', day: 'Tuesday', meal: 'Dinner', recipeName: 'Vegetable Stir Fry', description: 'Tofu and mixed veggies' },
      { id: '5', day: 'Wednesday', meal: 'Lunch', recipeName: 'Lentil Soup', description: 'Hearty and warm' },
      { id: '6', day: 'Wednesday', meal: 'Dinner', recipeName: 'Chicken Tacos', description: 'Corn tortillas with salsa' },
    ];
    return { data: mockMenu };
  }

  if (config.url?.includes('/shopping/latest')) {
    const mockShopping: ShoppingItem[] = [
      { id: '1', name: 'Quinoa', category: 'Grains', checked: false },
      { id: '2', name: 'Salmon Fillet', category: 'Protein', checked: false },
      { id: '3', name: 'Avocado', category: 'Produce', checked: true },
      { id: '4', name: 'Asparagus', category: 'Produce', checked: false },
    ];
    return { data: mockShopping };
  }
  
  if (config.url?.includes('/subscription-status')) {
      return { data: { status: 'trial' } };
  }

  return Promise.reject(error);
});

export default api;
