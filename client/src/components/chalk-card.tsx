import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ChalkCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const ChalkCard = forwardRef<HTMLDivElement, ChalkCardProps>(
  ({ className, children, title, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative bg-card/90 backdrop-blur-sm p-6 text-card-foreground',
          'border border-white/10 shadow-lg rounded-xl',
          'before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-white/20 before:pointer-events-none',
          'before:content-[""] before:skew-y-[0.5deg] before:opacity-50', // Imperfect border effect
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="font-display text-2xl mb-4 border-b border-white/20 pb-2 text-primary">
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  }
);

ChalkCard.displayName = 'ChalkCard';
