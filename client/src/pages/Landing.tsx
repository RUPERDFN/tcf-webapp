import { Link } from 'wouter';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Logo real */}
      <div className="mb-12 fade-in">
        <div className="text-center">
          <img 
            src="/logos/logo.png" 
            alt="TheCookFlow" 
            className="w-48 h-auto mx-auto mb-4 drop-shadow-2xl"
          />
          <h1 className="text-6xl md:text-7xl font-chalk text-white">
            The CookFlow
          </h1>
        </div>
      </div>

      {/* Título */}
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

      {/* Iconos reales */}
      <div className="flex gap-8 fade-in justify-center flex-wrap" style={{animationDelay: '0.6s'}}>
        <img src="/icons/tomate.png" alt="Tomate" className="w-16 h-16 hover:scale-110 transition-transform drop-shadow-lg object-contain" />
        <img src="/icons/zanahoria.png" alt="Zanahoria" className="w-16 h-16 hover:scale-110 transition-transform drop-shadow-lg object-contain" />
        <img src="/icons/pimiento.png" alt="Pimiento" className="w-16 h-16 hover:scale-110 transition-transform drop-shadow-lg object-contain" />
        <img src="/icons/limon.png" alt="Limón" className="w-16 h-16 hover:scale-110 transition-transform drop-shadow-lg object-contain" />
      </div>
    </div>
  );
}
