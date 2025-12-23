import { Link } from 'wouter';
import Button from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 backdrop-blur-sm bg-chalkboard-dark/30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.png" alt="TheCookFlow" className="h-12 w-12 rounded-full object-cover" />
            <h1 className="text-3xl font-chalk text-chalk-white">TheCookFlow</h1>
          </div>
          <Link href="/login">
            <button className="text-chalk-white hover:text-accent-green transition-colors font-semibold cursor-pointer">
              Entrar
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-chalk-write">
            <h2 className="text-6xl md:text-7xl font-chalk mb-4 text-chalk-white">
              ¿Qué quieres comer
            </h2>
            <h2 className="text-6xl md:text-7xl font-chalk mb-4 text-chalk-white">
              esta semana?
            </h2>
          </div>

          <p className="text-2xl md:text-3xl text-chalk-cream mb-8 font-body max-w-3xl mx-auto animate-chalk-write" style={{animationDelay: '0.2s'}}>
            Tu chef personal con IA. Menús semanales + lista de compra automática en 2 minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-chalk-write" style={{animationDelay: '0.4s'}}>
            <Link href="/register">
              <Button variant="primary" className="w-full sm:w-auto">
                🍎 Empezar Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="w-full sm:w-auto">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>

          {/* Iconos decorativos */}
          <div className="flex justify-center gap-8 mt-16 flex-wrap animate-chalk-write" style={{animationDelay: '0.6s'}}>
            <img src="/icons/tomate.png" alt="Tomate" className="food-icon" />
            <img src="/icons/zanahoria.png" alt="Zanahoria" className="food-icon" />
            <img src="/icons/pimiento.png" alt="Pimiento" className="food-icon" />
            <img src="/icons/limon.png" alt="Limón" className="food-icon" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 backdrop-blur-sm bg-chalkboard-dark/30 border-t-2 border-chalkboard-light">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-chalk-cream font-body">
            © 2025 TheCookFlow - Planificación inteligente de menús
          </p>
        </div>
      </footer>
    </div>
  );
}
