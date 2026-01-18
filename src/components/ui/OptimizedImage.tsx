// src/components/ui/OptimizedImage.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoadComplete?: () => void;
  className?: string;
  imgClassName?: string;
}

// Helper to add Cloudinary transformations
const getCloudinaryUrl = (src: string, width?: number, quality = 80): string => {
  if (!src.includes('cloudinary.com')) return src;

  // Parse Cloudinary URL and add transformations
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  transformations.push(`q_${quality}`);
  transformations.push('f_auto'); // Auto format (webp, avif)

  const transformString = transformations.join(',');

  // Insert transformations into URL
  return src.replace('/upload/', `/upload/${transformString}/`);
};

// Helper to add Sanity image transformations
const getSanityUrl = (src: string, width?: number, quality = 80): string => {
  if (!src.includes('cdn.sanity.io')) return src;

  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  params.set('q', String(quality));
  params.set('auto', 'format');

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}${params.toString()}`;
};

// Get optimized URL
const getOptimizedUrl = (src: string, width?: number): string => {
  if (src.includes('cloudinary.com')) {
    return getCloudinaryUrl(src, width);
  }
  if (src.includes('cdn.sanity.io')) {
    return getSanityUrl(src, width);
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
  const generateSrcSet = (): string | undefined => {
    if (!src || src.startsWith('data:')) return undefined;

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
          className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-pink-900/20 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={getOptimizedUrl(src, width)}
        srcSet={generateSrcSet()}
        sizes={generateSizes()}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
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
