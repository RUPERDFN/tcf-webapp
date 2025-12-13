import { Layout } from '@/components/layout';
import { ChalkCard } from '@/components/chalk-card';
import { ChalkButton } from '@/components/chalk-button';
import { Check, Star, Crown } from 'lucide-react';

export default function PremiumPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 space-y-10 text-center">
        <div className="space-y-4">
          <Crown className="w-16 h-16 text-accent mx-auto" />
          <h1 className="text-4xl md:text-5xl font-display text-accent">Upgrade to Chef Pro</h1>
          <p className="text-xl text-white/70 max-w-xl mx-auto">
            Unlock the full potential of your kitchen with unlimited recipes, advanced filters, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <ChalkCard className="h-full flex flex-col">
             <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <div className="text-4xl font-display">€0<span className="text-lg text-muted-foreground font-sans">/mo</span></div>
             </div>
             <ul className="space-y-4 text-left flex-1 mb-8">
               <li className="flex items-center gap-3"><Check className="text-primary" /> Weekly Menu Generation</li>
               <li className="flex items-center gap-3"><Check className="text-primary" /> Basic Shopping List</li>
               <li className="flex items-center gap-3 opacity-50"><Check /> Unlimited Recipe Swaps</li>
               <li className="flex items-center gap-3 opacity-50"><Check /> Nutritional Info</li>
               <li className="flex items-center gap-3 opacity-50"><Check /> Export to Instacart</li>
             </ul>
             <ChalkButton variant="outline" disabled>Current Plan</ChalkButton>
          </ChalkCard>

          <ChalkCard className="h-full flex flex-col border-accent/50 shadow-[0_0_30px_rgba(236,72,153,0.2)] transform scale-105">
             <div className="absolute top-0 right-0 bg-accent text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
               RECOMMENDED
             </div>
             <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-accent">Pro Chef</h3>
                <div className="text-4xl font-display">€9<span className="text-lg text-muted-foreground font-sans">/mo</span></div>
             </div>
             <ul className="space-y-4 text-left flex-1 mb-8">
               <li className="flex items-center gap-3"><Star className="text-accent w-4 h-4" /> Everything in Free</li>
               <li className="flex items-center gap-3"><Check className="text-accent" /> Unlimited Recipe Swaps</li>
               <li className="flex items-center gap-3"><Check className="text-accent" /> Advanced Filters (Keto, Paleo)</li>
               <li className="flex items-center gap-3"><Check className="text-accent" /> PDF Export</li>
               <li className="flex items-center gap-3"><Check className="text-accent" /> Priority Support</li>
             </ul>
             <ChalkButton variant="accent">Go Premium</ChalkButton>
          </ChalkCard>
        </div>
      </div>
    </Layout>
  );
}
