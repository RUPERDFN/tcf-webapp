import { useState } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { ChalkButton } from '@/components/chalk-button';
import { ChalkCard } from '@/components/chalk-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const login = useStore((state) => state.login);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user);
      toast({ title: "Welcome back!", description: "Let's get cooking." });
      setLocation('/onboarding');
    } catch (error) {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNav>
      <div className="flex items-center justify-center min-h-[80vh]">
        <ChalkCard className="w-full max-w-md" title="Chef Login">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>

            <ChalkButton type="submit" className="w-full" isLoading={isLoading}>
              Start Cooking
            </ChalkButton>
            
            <p className="text-center text-sm text-muted-foreground">
              New chef? <span className="text-primary cursor-pointer hover:underline">Create account</span>
            </p>
          </form>
        </ChalkCard>
      </div>
    </Layout>
  );
}
