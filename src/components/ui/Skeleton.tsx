// Composant Skeleton pour les états de chargement
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

/**
 * Composant Skeleton - Affiche un placeholder animé pendant le chargement
 *
 * @example
 * // Texte simple
 * <Skeleton variant="text" />
 *
 * @example
 * // Avatar circulaire
 * <Skeleton variant="circular" width={40} height={40} />
 *
 * @example
 * // Card complète
 * <Skeleton variant="card" />
 *
 * @example
 * // Plusieurs lignes de texte
 * <Skeleton variant="text" lines={3} />
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // Pour les lignes de texte multiples
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%', // Dernière ligne plus courte
            }}
          />
        ))}
      </div>
    );
  }

  // Card skeleton avec structure complète
  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${variantClasses.card} overflow-hidden ${className}`} style={style}>
        {/* Image placeholder */}
        <div className="aspect-[16/9] bg-gray-300 dark:bg-gray-600" />

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Badge */}
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded-full" />

          {/* Title */}
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton pour une grille de cards
 */
export const SkeletonGrid: React.FC<{
  count?: number;
  columns?: number;
  className?: string;
}> = ({ count = 6, columns = 3, className = '' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns as keyof typeof gridClasses] || gridClasses[3]} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant="card" />
      ))}
    </div>
  );
};

/**
 * Skeleton pour un article complet
 */
export const SkeletonArticle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`max-w-4xl mx-auto space-y-8 ${className}`}>
    {/* Hero image */}
    <Skeleton variant="rectangular" className="w-full aspect-[21/9]" />

    {/* Title */}
    <div className="space-y-4">
      <Skeleton variant="text" className="h-8 w-3/4" />
      <Skeleton variant="text" className="h-6 w-1/2" />
    </div>

    {/* Meta */}
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-32" />
        <Skeleton variant="text" className="h-3 w-24" />
      </div>
    </div>

    {/* Content */}
    <div className="space-y-4">
      <Skeleton variant="text" lines={4} />
      <Skeleton variant="rectangular" className="w-full h-64" />
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="text" lines={5} />
    </div>
  </div>
);

/**
 * Skeleton pour la sidebar
 */
export const SkeletonSidebar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Section title */}
    <Skeleton variant="text" className="h-6 w-40" />

    {/* Items */}
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex gap-3">
        <Skeleton variant="rectangular" width={80} height={60} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4" />
          <Skeleton variant="text" className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
