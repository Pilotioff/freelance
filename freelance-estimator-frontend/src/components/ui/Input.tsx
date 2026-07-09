import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, labelClassName = 'text-muted', className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className={`text-sm font-medium ${labelClassName}`}>{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-background border border-slate-600 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
