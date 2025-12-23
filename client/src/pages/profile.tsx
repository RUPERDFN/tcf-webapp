import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';
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
  const onboardingState = useOnboardingStore();
  const [formData, setFormData] = useState<any>(onboardingState);
  const [allergyInput, setAllergyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Sync local state with store on mount
  useEffect(() => {
    setFormData(onboardingState);
  }, [onboardingState]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await profileAPI.update(formData);
      
      // Update store manually field by field or if store had a bulk update
      // onboardingState only has setField.
      // We'll just iterate for now or assume backend sync is enough, but UI needs store update.
      Object.keys(formData).forEach(key => {
         onboardingState.setField(key, formData[key]);
      });

      toast({ title: "Profile Updated", description: "Your preferences have been saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const addAllergy = () => {
    if (allergyInput && !formData.allergies?.includes(allergyInput)) {
      setFormData({ ...formData, allergies: [...(formData.allergies || []), allergyInput] });
      setAllergyInput('');
    }
  };

  const removeAllergy = (a: string) => {
    setFormData({ ...formData, allergies: formData.allergies.filter((i: string) => i !== a) });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-display">Chef Profile</h2>
        
        <ChalkCard title="Account Details">
           <div className="grid gap-4">
             <div className="grid gap-2">
               <Label>Name</Label>
               <Input value={user?.id || 'Chef'} disabled className="bg-white/5 border-white/10 text-white/50" />
             </div>
             <div className="grid gap-2">
               <Label>Email</Label>
               <Input value={user?.email || 'chef@example.com'} disabled className="bg-white/5 border-white/10 text-white/50" />
             </div>
           </div>
        </ChalkCard>

        <ChalkCard title="Cooking Preferences">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>People</Label>
                 <Input 
                   type="number" 
                   value={formData.diners || 1} 
                   onChange={(e) => setFormData({...formData, diners: parseInt(e.target.value)})}
                   className="bg-transparent border-white/20"
                 />
               </div>
               <div className="space-y-2">
                 <Label>Meals/Day</Label>
                 <Select value={String(formData.meals_per_day || '2')} onValueChange={(v) => setFormData({...formData, meals_per_day: parseInt(v)})}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
               </div>
            </div>

            <div className="space-y-2">
               <Label>Diet Type</Label>
               <Select value={formData.diet_type || 'omnivore'} onValueChange={(v) => setFormData({...formData, diet_type: v})}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivora">Omnivore</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Allergies</Label>
              <div className="flex gap-2">
                <Input 
                  value={allergyInput} 
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Add allergy..." 
                  className="bg-transparent border-white/20"
                />
                <ChalkButton type="button" onClick={addAllergy} variant="secondary">Add</ChalkButton>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {formData.allergies?.map((a: string) => (
                  <Badge key={a} variant="secondary" className="flex items-center gap-1">
                    {a} <X className="w-3 h-3 cursor-pointer" onClick={() => removeAllergy(a)} />
                  </Badge>
                ))}
              </div>
            </div>

            <ChalkButton onClick={handleSave} isLoading={isLoading} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Save Preferences
            </ChalkButton>
          </div>
        </ChalkCard>
      </div>
    </Layout>
  );
}
