import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-chalk-white font-semibold font-sans">{label}</label>}
      <input className={`input-chalk ${className}`} {...props} />
    </div>
  );
}
