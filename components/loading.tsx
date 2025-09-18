'use client';

import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div 
      className={`
        bg-gray-200 rounded-md
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
}

interface SkeletonTextProps extends SkeletonProps {
  lines?: number;
}

export function SkeletonText({ lines = 1, className = '', animate = true }: SkeletonTextProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-4/5' : 'w-full'} ${className}`}
          animate={animate}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  children: ReactNode;
  loading?: boolean;
}

export function SkeletonCard({ children, loading = false }: SkeletonCardProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <SkeletonText lines={3} />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center">
      <div className={`${sizeStyles[size]} border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin`} />
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <span className={`inline-flex space-x-1 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}