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
  const onboardingData = useOnboardingStore();
  const { setMenu, setShoppingList } = useDashboardStore();
  const { toast } = useToast();
  const [status, setStatus] = useState('Talking to the Chef...');

  useEffect(() => {
    const generate = async () => {
      try {
        setStatus('Curating recipes...');
        // menuAPI.generate expects "profile" object. onboardingData IS the profile structure roughly.
        await menuAPI.generate(onboardingData, onboardingData.days);
        
        setStatus('Planning your week...');
        const menuRes = await menuAPI.getLatest();
        setMenu(menuRes.data);

        setStatus('Writing shopping list...');
        const shopRes = await shoppingAPI.getLatest();
        setShoppingList(shopRes.data);
        
        // Finalize (Mock save calls if needed, or already handled by generate flow in real backend)
        // Since we are mocking, menuAPI.generate returns data but getLatest fetches it. 
        // In our mock api.ts, getLatest returns static data.
        
        setTimeout(() => setLocation('/dashboard'), 1000);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Chef burned the food. Try again.", variant: "destructive" });
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
          <p className="text-muted-foreground">This might take a few seconds.</p>
        </div>
      </div>
    </Layout>
  );
}
