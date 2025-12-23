import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuthStore } from '../../lib/stores/authStore';
import { authAPI } from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.register(email, password);
      login(response.data.user, response.data.token);
      toast.success('¡Cuenta creada!');
      setLocation('/onboarding/1'); // Start onboarding flow
    } catch (error: any) {
      toast.error('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-chalk w-full max-w-md">
        <h2 className="text-4xl mb-6 text-center text-accent-green">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nuevo@chef.com"
          />
          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cargando...' : 'Registrarse'}
          </Button>
        </form>
        <p className="text-center mt-4">
          ¿Ya tienes cuenta? <Link href="/login"><span className="text-accent-green cursor-pointer hover:underline">Inicia Sesión</span></Link>
        </p>
      </div>
    </div>
  );
}
