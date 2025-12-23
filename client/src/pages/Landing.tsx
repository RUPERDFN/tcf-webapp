import { Link } from 'wouter';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-chalkboard-dark text-chalk-white">
      <h1 className="text-6xl mb-6 text-center text-accent-green drop-shadow-lg font-display transform -rotate-2">
        TheCookFlow
      </h1>
      <p className="text-2xl text-chalk-cream mb-12 text-center max-w-2xl font-body">
        Tu chef personal con IA. Menús semanales + lista de compra en 2 minutos.
      </p>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Link href="/register">
          <button className="btn-primary">Empezar Gratis</button>
        </Link>
        <Link href="/login">
          <button className="btn-secondary">Ya tengo cuenta</button>
        </Link>
      </div>
    </div>
  );
}
