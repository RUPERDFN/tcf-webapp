import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ChalkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline';
  isLoading?: boolean;
}

export const ChalkButton = forwardRef<HTMLButtonElement, ChalkButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'bg-transparent border-2 border-white/50 hover:bg-white/10 text-white',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-3 font-display font-bold text-lg transition-all duration-200',
          'chalk-border transform hover:-translate-y-0.5 active:translate-y-0',
          variants[variant],
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />}
        {children}
      </button>
    );
  }
);

ChalkButton.displayName = 'ChalkButton';
