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

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full animate-spin ${className} border-white/20 border-t-white`}
    />
  );
}

interface LoadingScreenProps {
  message?: string;
  isTransparent?: boolean;
}

export function LoadingScreen({ message = 'Loading...', isTransparent = false }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${isTransparent ? 'bg-transparent' : 'bg-gray-900/5 backdrop-blur-sm'} rounded-xl p-8`}>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
    </div>
  );
}

export function LoadingCard({ message = 'Loading...', isTransparent = false }: LoadingScreenProps) {
  return (
    <div className={`space-y-8 ${isTransparent ? '' : 'p-6'}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded-full w-3/4 mx-auto" />
        <div className="h-48 bg-gray-200 rounded-full w-48 mx-auto" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
      <div className="text-center text-gray-600">{message}</div>
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