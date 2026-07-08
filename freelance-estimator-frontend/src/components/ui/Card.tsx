import { ReactNode, MouseEventHandler } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-10',
};

export function Card({ children, className = '', padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={`bg-card rounded-2xl border border-slate-700/50 ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
