import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useOnboardingStore, type OnboardingData, type DietType } from '@/lib/stores/onboardingStore';
import { profileAPI } from '@/lib/api';
import { Layout } from '@/components/layout';
import { ChalkCard } from '@/components/chalk-card';
import { ChalkButton } from '@/components/chalk-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { data, updateData } = useOnboardingStore();
  const [formData, setFormData] = useState<OnboardingData>(data);
  const [allergyInput, setAllergyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await profileAPI.update({
        budget_eur_week: formData.budgetWeekly,
        diners: formData.diners,
        meals_per_day: formData.mealsPerDay,
        days: formData.daysPerWeek,
        diet_type: formData.dietType,
        allergies: formData.allergies,
        disliked_foods: formData.dislikes,
        pantry_items: formData.pantryItems.join(', '),
      });
      
      updateData(formData);
      toast({ title: "Perfil Actualizado", description: "Tus preferencias han sido guardadas." });
    } catch (error) {
      toast({ title: "Error", description: "Error al guardar el perfil.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const addAllergy = () => {
    if (allergyInput && !formData.allergies.includes(allergyInput)) {
      setFormData({ ...formData, allergies: [...formData.allergies, allergyInput] });
      setAllergyInput('');
    }
  };

  const removeAllergy = (a: string) => {
    setFormData({ ...formData, allergies: formData.allergies.filter((i) => i !== a) });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-display">Perfil del Chef</h2>
        
        <ChalkCard title="Datos de Cuenta">
           <div className="grid gap-4">
             <div className="grid gap-2">
               <Label>Email</Label>
               <Input value={user?.email || 'chef@example.com'} disabled className="bg-white/5 border-white/10 text-white/50" />
             </div>
           </div>
        </ChalkCard>

        <ChalkCard title="Preferencias de Cocina">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Comensales</Label>
                 <Input 
                   type="number" 
                   value={formData.diners || 1} 
                   onChange={(e) => setFormData({...formData, diners: parseInt(e.target.value) || 1})}
                   className="bg-transparent border-white/20"
                   min={1}
                   max={10}
                   data-testid="input-diners"
                 />
               </div>
               <div className="space-y-2">
                 <Label>Comidas/Día</Label>
                 <Select value={String(formData.mealsPerDay || 3)} onValueChange={(v) => setFormData({...formData, mealsPerDay: parseInt(v)})}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Presupuesto Semanal (€)</Label>
                 <Input 
                   type="number" 
                   value={formData.budgetWeekly || 50} 
                   onChange={(e) => setFormData({...formData, budgetWeekly: parseInt(e.target.value) || 50})}
                   className="bg-transparent border-white/20"
                   min={20}
                   max={200}
                   data-testid="input-budget"
                 />
               </div>
               <div className="space-y-2">
                 <Label>Días/Semana</Label>
                 <Select value={String(formData.daysPerWeek || 5)} onValueChange={(v) => setFormData({...formData, daysPerWeek: parseInt(v)})}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7].map(d => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
               </div>
            </div>

            <div className="space-y-2">
               <Label>Tipo de Dieta</Label>
               <Select value={formData.dietType || 'omnivora'} onValueChange={(v) => setFormData({...formData, dietType: v as DietType})}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivora">Omnívora</SelectItem>
                    <SelectItem value="vegetariana">Vegetariana</SelectItem>
                    <SelectItem value="vegana">Vegana</SelectItem>
                    <SelectItem value="pescetariana">Pescetariana</SelectItem>
                    <SelectItem value="sin_gluten">Sin Gluten</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Alergias</Label>
              <div className="flex gap-2">
                <Input 
                  value={allergyInput} 
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Añadir alergia..." 
                  className="bg-transparent border-white/20"
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  data-testid="input-allergy"
                />
                <ChalkButton type="button" onClick={addAllergy} variant="secondary">Añadir</ChalkButton>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {formData.allergies?.map((a) => (
                  <Badge key={a} variant="secondary" className="flex items-center gap-1">
                    {a} <X className="w-3 h-3 cursor-pointer" onClick={() => removeAllergy(a)} />
                  </Badge>
                ))}
              </div>
            </div>

            <ChalkButton onClick={handleSave} isLoading={isLoading} className="w-full" data-testid="button-save">
              <Save className="mr-2 h-4 w-4" /> Guardar Preferencias
            </ChalkButton>
          </div>
        </ChalkCard>
      </div>
    </Layout>
  );
}
