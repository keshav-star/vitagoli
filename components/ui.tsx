'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-pink-500/25",
    outline: "border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
  };

  const sizeStyles = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Card({ children, className = '', gradient = false }: CardProps) {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-8
        ${gradient 
          ? 'bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/20' 
          : 'bg-white/80 backdrop-blur-xl shadow-xl shadow-black/5'}
        transition-transform duration-300 hover:scale-[1.02]
        ${className}
      `}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 -z-10" />
      )}
      {children}
    </div>
  );
}

interface QuizLayoutProps {
  children: ReactNode;
  hideBackground?: boolean;
  className?: string;
}

export function QuizLayout({ children, hideBackground = false, className = '' }: QuizLayoutProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`}>
      {/* Decorative elements */}
      {!hideBackground && (
        <div className="absolute top-0 left-0 w-full h-full opacity-60 dark:opacity-30">
          <div 
            className="absolute -top-4 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-300 dark:bg-purple-600 rounded-full 
            mix-blend-multiply dark:mix-blend-hard-light filter blur-xl animate-blob" 
          />
          <div 
            className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full 
            mix-blend-multiply dark:mix-blend-hard-light filter blur-xl animate-blob animation-delay-2000"
          />
          <div 
            className="absolute -bottom-8 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-pink-300 dark:bg-pink-600 rounded-full 
            mix-blend-multiply dark:mix-blend-hard-light filter blur-xl animate-blob animation-delay-4000"
          />
          <div 
            className="absolute top-1/2 -right-8 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 dark:bg-blue-600 rounded-full 
            mix-blend-multiply dark:mix-blend-hard-light filter blur-xl animate-blob animation-delay-6000"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative min-h-screen py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export {
  LoadingSpinner,
  LoadingDots,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  LoadingCard,
} from './loading';

// Re-export from ui components
export * from './ui/glass-card';
export * from './ui/gradient-text';
export * from './ui/button';
export * from './ui/hero-section';
export * from './ui/input';