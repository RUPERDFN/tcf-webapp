import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary'; // Added secondary just in case
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  let baseClass = 'btn-siguiente';
  
  if (variant === 'outline') {
    baseClass = 'btn-outline';
  } else if (variant === 'secondary') {
    baseClass = 'btn-outline'; // Map secondary to outline if needed or keep existing btn-secondary
  }
  
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
