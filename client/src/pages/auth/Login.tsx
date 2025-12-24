import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuthStore } from '../../lib/stores/authStore';
import { authAPI } from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      login(response.data.user, response.data.token);
      toast.success('¡Bienvenido!');
      setLocation('/dashboard');
    } catch (error: any) {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-tcf w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <img src="/logos/logo.png" alt="TheCookFlow" className="w-16 h-16 mx-auto mb-2" />
          <h2 className="text-4xl font-chalk text-accent-green">Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="chef@example.com"
              className="input-tcf"
              data-testid="input-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="input-tcf"
              data-testid="input-password"
            />
          </div>
          <Button type="submit" className="w-full btn-siguiente" disabled={loading} data-testid="button-submit">
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center mt-4 text-gray-300">
          ¿No tienes cuenta? <Link href="/register"><span className="text-accent-green cursor-pointer hover:underline" data-testid="link-register">Regístrate</span></Link>
        </p>
      </div>
    </div>
  );
}
