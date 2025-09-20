import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  hoverEffect?: boolean;
  darkMode?: boolean;
}

export function GlassCard({
  children,
  className = '',
  animate = false,
  onClick,
  hoverEffect = true,
  darkMode = false
}: GlassCardProps) {
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: hoverEffect ? {
      scale: 1.02,
      transition: { duration: 0.2 }
    } : {},
    tap: hoverEffect ? {
      scale: 0.98,
      transition: { duration: 0.1 }
    } : {}
  };

  return (
    <motion.div
      initial={animate ? "initial" : undefined}
      animate={animate ? "animate" : undefined}
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6
        ${darkMode
          ? 'bg-gray-900/40 backdrop-blur-lg border border-gray-800/50'
          : 'bg-white/70 backdrop-blur-lg border border-white/20'}
        shadow-xl shadow-black/5
        transition-colors duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className={`
        absolute inset-0 -z-10
        ${darkMode
          ? 'bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10'
          : 'bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5'}
      `} />

      {children}
    </motion.div>
  );
}