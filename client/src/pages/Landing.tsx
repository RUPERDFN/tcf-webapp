import { Link } from 'wouter';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Logo con manzana */}
      <div className="logo-container mb-12 fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Puedes usar un emoji o el logo PNG real */}
            <span className="text-7xl drop-shadow-lg">🍎</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-chalk text-white">
            The CookFlow
          </h1>
        </div>
      </div>

      {/* Título principal */}
      <div className="text-center max-w-2xl mb-12 fade-in" style={{animationDelay: '0.2s'}}>
        <h2 className="text-4xl md:text-5xl font-chalk text-white mb-6">
          ¿Qué quieres comer esta semana?
        </h2>
        <p className="text-xl text-gray-300 font-body">
          Tu chef personal con IA. Menús semanales personalizados y lista de compra automática.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16 fade-in" style={{animationDelay: '0.4s'}}>
        <Link href="/register">
          <button className="btn-siguiente">
            Empezar gratis
          </button>
        </Link>
        <Link href="/login">
          <button className="btn-outline">
            Ya tengo cuenta
          </button>
        </Link>
      </div>

      {/* Iconos decorativos */}
      <div className="flex gap-8 fade-in flex-wrap justify-center" style={{animationDelay: '0.6s'}}>
        <span className="text-6xl drop-shadow-lg filter hover:scale-110 transition-transform cursor-default">🍅</span>
        <span className="text-6xl drop-shadow-lg filter hover:scale-110 transition-transform cursor-default">🥕</span>
        <span className="text-6xl drop-shadow-lg filter hover:scale-110 transition-transform cursor-default">🌶️</span>
        <span className="text-6xl drop-shadow-lg filter hover:scale-110 transition-transform cursor-default">🥒</span>
      </div>
    </div>
  );
}
