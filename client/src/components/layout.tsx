import { ReactNode } from 'react';
import chalkboardBg from '@assets/generated_images/dark_chalkboard_texture_background.png';
import logo from '@assets/generated_images/thecookflow_logo_chalk_style.png';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { LogOut, User, Home, ShoppingCart, Star } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav = false }: LayoutProps) {
  const [location] = useLocation();
  const logout = useStore((state) => state.logout);

  return (
    <div 
      className="min-h-screen w-full flex flex-col text-foreground font-sans selection:bg-primary selection:text-primary-foreground"
      style={{
        backgroundImage: `url(${chalkboardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
      
      <header className="relative z-10 p-4 flex justify-between items-center border-b border-white/10 bg-black/10 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TheCookFlow" className="h-10 w-10 rounded-full bg-white/10 p-1" />
          <h1 className="font-display text-2xl font-bold tracking-wider">TheCookFlow</h1>
        </div>
        
        {!hideNav && (
          <nav className="hidden md:flex gap-6 items-center">
            <NavLink href="/dashboard" icon={Home} label="Dashboard" active={location === '/dashboard'} />
            <NavLink href="/history" icon={ShoppingCart} label="History" active={location === '/history'} />
            <NavLink href="/premium" icon={Star} label="Premium" active={location === '/premium'} />
            <NavLink href="/profile" icon={User} label="Profile" active={location === '/profile'} />
            <button onClick={() => logout()} className="text-destructive hover:text-destructive/80 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        )}
      </header>

      <main className="relative z-10 flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>

      {!hideNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-white/10 p-4 flex justify-around z-50 safe-area-bottom">
           <NavLink href="/dashboard" icon={Home} label="Home" active={location === '/dashboard'} />
           <NavLink href="/premium" icon={Star} label="Premium" active={location === '/premium'} />
           <NavLink href="/profile" icon={User} label="Profile" active={location === '/profile'} />
        </nav>
      )}
    </div>
  );
}

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <a className={cn(
        "flex flex-col md:flex-row items-center gap-2 transition-colors",
        active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
      )}>
        <Icon className="w-6 h-6 md:w-5 md:h-5" />
        <span className="text-xs md:text-sm">{label}</span>
      </a>
    </Link>
  );
}
