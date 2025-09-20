import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from './gradient-text';

interface HeroSectionProps {
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
  darkMode?: boolean;
}

export function HeroSection({
  title,
  description,
  children,
  className = '',
  darkMode = false,
}: HeroSectionProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`
        relative overflow-hidden
        ${darkMode ? 'text-white' : 'text-gray-900'}
        ${className}
      `}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className={`
          absolute inset-0
          ${darkMode
            ? 'bg-gradient-mesh opacity-20'
            : 'bg-gradient-mesh opacity-40'}
        `} />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <motion.div variants={itemVariants} className="space-y-4">
            {typeof title === 'string' ? (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <GradientText animate>{title}</GradientText>
              </h1>
            ) : (
              title
            )}
            <motion.p
              variants={itemVariants}
              className={`
                max-w-2xl mx-auto text-lg sm:text-xl
                ${darkMode ? 'text-gray-300' : 'text-gray-600'}
              `}
            >
              {description}
            </motion.p>
          </motion.div>

          {children && (
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}