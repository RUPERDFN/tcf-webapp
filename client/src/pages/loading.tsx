import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { menuAPI, shoppingAPI } from '@/lib/api';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { Layout } from '@/components/layout';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoadingPage() {
  const [, setLocation] = useLocation();
  const { data } = useOnboardingStore();
  const { setMenu, setShoppingList } = useDashboardStore();
  const { toast } = useToast();
  const [status, setStatus] = useState('Hablando con el Chef...');

  useEffect(() => {
    const generate = async () => {
      try {
        setStatus('Seleccionando recetas...');
        
        const profile = {
          budget_eur_week: data.budgetWeekly,
          diners: data.diners,
          meals_per_day: data.mealsPerDay,
          days: data.daysPerWeek,
          diet_type: data.dietType,
          allergies: data.allergies,
          disliked_foods: data.dislikes,
          pantry_items: data.pantryItems.join(', '),
        };
        
        await menuAPI.generate(profile, data.daysPerWeek);
        
        setStatus('Planificando tu semana...');
        const menuRes = await menuAPI.getLatest();
        setMenu(menuRes.data);

        setStatus('Creando lista de compra...');
        const shopRes = await shoppingAPI.getLatest();
        setShoppingList(shopRes.data);
        
        setTimeout(() => setLocation('/dashboard'), 1000);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "El chef quemó la comida. Inténtalo de nuevo.", variant: "destructive" });
        setLocation('/onboarding/1');
      }
    };

    generate();
  }, []);

  return (
    <Layout hideNav>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
        <div className="relative">
          <Loader2 className="w-24 h-24 animate-spin text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">👨‍🍳</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-display animate-pulse text-white">{status}</h2>
          <p className="text-muted-foreground">Esto puede tardar unos segundos.</p>
        </div>
      </div>
    </Layout>
  );
}
