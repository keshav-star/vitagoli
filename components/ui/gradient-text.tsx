import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = '',
  from = 'from-accent-primary',
  to = 'to-accent-secondary',
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={`
        bg-clip-text text-transparent
        bg-gradient-to-r ${from} ${to}
        ${animate ? 'animate-gradient-x' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
}