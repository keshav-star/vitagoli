import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../loading';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
  darkMode?: boolean;
}

export function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  darkMode = false,
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary/20
    dark:focus:ring-accent-secondary/20
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-accent-primary to-accent-secondary
      text-white
      hover:from-accent-primary/90 hover:to-accent-secondary/90
      shadow-lg hover:shadow-accent-primary/25
      dark:hover:shadow-accent-secondary/25
    `,
    secondary: `
      bg-gradient-to-r from-pink-500 to-rose-500
      text-white
      hover:from-pink-600 hover:to-rose-600
      shadow-lg hover:shadow-pink-500/25
    `,
    outline: `
      border-2
      ${darkMode
        ? 'border-accent-secondary text-accent-secondary hover:bg-accent-secondary/10'
        : 'border-accent-primary text-accent-primary hover:bg-accent-primary/10'}
    `,
    glass: `
      ${darkMode
        ? 'bg-gray-900/40 text-white border border-gray-800/50'
        : 'bg-white/70 text-gray-900 border border-white/20'}
      backdrop-blur-lg
      hover:bg-opacity-80
      shadow-lg
    `,
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-base px-4 py-2 gap-2',
    lg: 'text-lg px-6 py-3 gap-3',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading && <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} />}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}