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
      toast.success('¡Cuenta creada! Comencemos...');
      setLocation('/onboarding/1');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-tcf w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <img src="/logos/logo.png" alt="TheCookFlow" className="w-16 h-16 mx-auto mb-2" />
          <h2 className="text-4xl font-chalk">Crear Cuenta</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Empezar gratis'}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-gray-300">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login">
             <span className="text-accent-green hover:underline cursor-pointer">
                Iniciar sesión
             </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
