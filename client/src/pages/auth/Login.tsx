import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuthStore } from '../../lib/stores/authStore';
import { authAPI } from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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
      <div className="card-chalk w-full max-w-md">
        <h2 className="text-4xl mb-6 text-center text-accent-green">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="chef@example.com"
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
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center mt-4">
          ¿No tienes cuenta? <Link href="/register"><span className="text-accent-green cursor-pointer hover:underline">Regístrate</span></Link>
        </p>
      </div>
    </div>
  );
}
