// src/components/ui/OptimizedImage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { urlFor, generateSrcSet, getBlurPlaceholder } from '../../lib/sanity';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto';
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'empty';
  onLoadComplete?: () => void;
  className?: string;
  imgClassName?: string;
}

// Get optimized URL - utilise les helpers Sanity
const getOptimizedUrl = (src: string, width?: number): string => {
  if (!src) return '';

  // Utiliser urlFor pour les images Sanity
  if (src.includes('cdn.sanity.io')) {
    return urlFor(src, { width, format: 'auto' });
  }

  // Cloudinary transformations
  if (src.includes('cloudinary.com')) {
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    transformations.push('q_80');
    transformations.push('f_auto');
    const transformString = transformations.join(',');
    return src.replace('/upload/', `/upload/${transformString}/`);
  }

  return src;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio = 'auto',
  priority = false,
  fetchPriority = 'auto',
  placeholder = 'empty',
  onLoadComplete,
  className = '',
  imgClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    auto: '',
  };

  // Generate srcset for responsive images
  const getSrcSet = (): string | undefined => {
    if (!src || src.startsWith('data:')) return undefined;

    // Utiliser generateSrcSet pour images Sanity
    if (src.includes('cdn.sanity.io')) {
      return generateSrcSet(src);
    }

    // Fallback pour autres sources
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(w => `${getOptimizedUrl(src, w)} ${w}w`)
      .join(', ');
  };

  // Generate sizes attribute
  const generateSizes = (): string => {
    return '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw';
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    // Image failed to load - error state will show fallback UI
  };

  // Preload priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedUrl(src, 1280);
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  // Fallback for error
  if (error) {
    return (
      <div
        className={`
          bg-gradient-to-br from-gray-800 to-gray-900
          flex items-center justify-center
          ${aspectClasses[aspectRatio]}
          ${className}
        `}
        role="img"
        aria-label={alt}
      >
        <span className="text-white/40 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
      {/* Placeholder blur effect */}
      {placeholder === 'blur' && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-pulse"
          style={{
            backgroundImage: src.includes('cdn.sanity.io')
              ? `url(${getBlurPlaceholder(src)})`
              : undefined,
            backgroundColor: !src.includes('cdn.sanity.io') ? 'rgba(139, 92, 246, 0.1)' : undefined,
          }}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={getOptimizedUrl(src, width)}
        srcSet={getSrcSet()}
        sizes={generateSizes()}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-expect-error fetchPriority is a valid HTML attribute but not yet in React types
        fetchpriority={priority ? 'high' : fetchPriority}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover
          transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${imgClassName}
        `}
        {...props}
      />
    </div>
  );
};

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
