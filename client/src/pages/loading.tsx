import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import api from '@/lib/api';
import { useStore } from '@/lib/store';
import { Layout } from '@/components/layout';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoadingPage() {
  const [, setLocation] = useLocation();
  const { setMenu, setShoppingList, onboardingData } = useStore();
  const { toast } = useToast();
  const [status, setStatus] = useState('Talking to the Chef...');

  useEffect(() => {
    const generate = async () => {
      try {
        setStatus('Curating recipes...');
        await api.post('/menu/generate', onboardingData);
        
        setStatus('Planning your week...');
        const menuRes = await api.get('/menus/latest'); // Mock endpoint to get "generated" menu
        setMenu(menuRes.data);

        setStatus('Writing shopping list...');
        const shopRes = await api.get('/shopping/latest');
        setShoppingList(shopRes.data);
        
        // Finalize API calls
        await api.post('/api/menus', { menu: menuRes.data });
        await api.post('/api/shopping', { list: shopRes.data });

        setTimeout(() => setLocation('/dashboard'), 1000);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Chef burned the food. Try again.", variant: "destructive" });
        setLocation('/onboarding');
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
