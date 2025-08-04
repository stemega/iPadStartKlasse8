import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Lädt...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400"></div>
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 dark:text-gray-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const LoadingSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="loading-shimmer rounded"></div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <LoadingSkeleton className="w-8 h-8 rounded-lg" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-4 rounded w-3/4" />
          <LoadingSkeleton className="h-3 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <LoadingSkeleton className="h-3 rounded w-full" />
        <LoadingSkeleton className="h-3 rounded w-2/3" />
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="category-grid">
      {Array.from({ length: 8 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSpinner;