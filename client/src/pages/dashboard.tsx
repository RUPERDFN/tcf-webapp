import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Layout } from '@/components/layout';
import { ChalkCard } from '@/components/chalk-card';
import { ChalkButton } from '@/components/chalk-button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Shuffle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DashboardPage() {
  const { menu, shoppingList, toggleShoppingItem } = useStore();
  const [, setLocation] = useLocation();

  if (menu.length === 0) {
    // Redirect if no data (dev convenience)
    // setLocation('/loading'); 
  }

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, typeof menu>);

  const days = Object.keys(groupedMenu);

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-display">This Week's Plan</h2>
          <ChalkButton variant="outline" className="text-sm px-3 py-1" onClick={() => setLocation('/loading')}>
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </ChalkButton>
        </div>

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-8">
            <TabsTrigger value="menu" className="data-[state=active]:bg-primary data-[state=active]:text-black">Menu</TabsTrigger>
            <TabsTrigger value="shopping" className="data-[state=active]:bg-accent data-[state=active]:text-black">Shopping List</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            {days.length > 0 ? days.map((day) => (
              <div key={day} className="space-y-4">
                <h3 className="text-xl font-bold text-primary border-b border-white/10 pb-2">{day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedMenu[day].map((item) => (
                    <ChalkCard key={item.id} className="p-4 flex flex-col gap-2 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-start">
                         <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.meal}</span>
                         <button className="text-xs text-accent hover:underline flex items-center gap-1">
                           <Shuffle className="w-3 h-3" /> Swap
                         </button>
                      </div>
                      <h4 className="font-display text-lg leading-tight">{item.recipeName}</h4>
                      <p className="text-sm text-white/60 line-clamp-2">{item.description}</p>
                    </ChalkCard>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 opacity-50">No menu generated. Go to Profile to setup.</div>
            )}
          </TabsContent>

          <TabsContent value="shopping">
            <ChalkCard title="Shopping List" className="max-w-2xl mx-auto">
              {shoppingList.length > 0 ? (
                <div className="space-y-4">
                   {['Produce', 'Protein', 'Grains', 'Other'].map(cat => {
                     const items = shoppingList.filter(i => i.category === cat || (!['Produce', 'Protein', 'Grains'].includes(i.category) && cat === 'Other'));
                     if (items.length === 0) return null;
                     return (
                       <div key={cat}>
                         <h4 className="text-sm font-bold text-accent mb-2 uppercase">{cat}</h4>
                         <div className="space-y-2">
                           {items.map(item => (
                             <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded">
                               <Checkbox 
                                 id={item.id} 
                                 checked={item.checked} 
                                 onCheckedChange={() => toggleShoppingItem(item.id)}
                                 className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                               />
                               <label
                                 htmlFor={item.id}
                                 className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none ${item.checked ? 'line-through text-white/30' : ''}`}
                               >
                                 {item.name}
                               </label>
                             </div>
                           ))}
                         </div>
                       </div>
                     )
                   })}
                </div>
              ) : (
                <div className="text-center py-10 opacity-50">List is empty.</div>
              )}
            </ChalkCard>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
