// src/components/ui/Card.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  color?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  overlay?: boolean;
  className?: string;
}

export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardTitleProps {
  as?: 'h2' | 'h3' | 'h4' | 'h5';
  className?: string;
  children: React.ReactNode;
}

export interface CardDescriptionProps {
  lines?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

export interface CardBadgeProps {
  color?: string;
  className?: string;
  children: React.ReactNode;
}

export interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

// Main Card Component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      href,
      color,
      className = '',
      children,
      onClick,
    },
    ref
  ) => {
    // Variant classes
    const variantClasses = {
      default: 'bg-black/40 border border-white/10 hover:border-white/20',
      elevated: 'bg-black/60 shadow-xl hover:shadow-2xl',
      outlined: 'bg-transparent border-2 hover:bg-black/20',
      glass: 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10',
    };

    // Size classes
    const sizeClasses = {
      sm: 'rounded-lg',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
    };

    const baseClasses = `
      group relative overflow-hidden transition-all duration-300
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${onClick || href ? 'cursor-pointer' : ''}
      ${className}
    `;

    const style: React.CSSProperties = color && variant === 'outlined'
      ? { borderColor: `${color}40` }
      : {};

    // If href is provided, render as Link
    if (href) {
      return (
        <Link to={href} className={baseClasses} style={style}>
          {children}
        </Link>
      );
    }

    // Otherwise render as div
    return (
      <div
        ref={ref}
        className={baseClasses}
        style={style}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Image Sub-component
const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  aspectRatio = 'video',
  overlay = true,
  className = '',
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
  };

  return (
    <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}
    </div>
  );
};

CardImage.displayName = 'CardImage';

// Card Content Sub-component
const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => (
  <div className={`p-4 md:p-6 ${className}`}>{children}</div>
);

CardContent.displayName = 'CardContent';

// Card Title Sub-component
const CardTitle: React.FC<CardTitleProps> = ({
  as: Component = 'h3',
  className = '',
  children,
}) => (
  <Component
    className={`
      font-montserrat font-bold text-white mb-2
      group-hover:text-violet-400 transition-colors
      ${className}
    `}
  >
    {children}
  </Component>
);

CardTitle.displayName = 'CardTitle';

// Card Description Sub-component
const CardDescription: React.FC<CardDescriptionProps> = ({
  lines = 3,
  className = '',
  children,
}) => {
  const lineClampClasses = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
  };

  return (
    <p
      className={`
        font-inter text-white/75 text-sm leading-relaxed
        ${lineClampClasses[lines]}
        ${className}
      `}
    >
      {children}
    </p>
  );
};

CardDescription.displayName = 'CardDescription';

// Card Badge Sub-component
const CardBadge: React.FC<CardBadgeProps> = ({ color, className = '', children }) => {
  const style: React.CSSProperties = color
    ? {
        backgroundColor: `${color}20`,
        color: color,
        borderWidth: '1px',
        borderColor: `${color}40`,
      }
    : {};

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
        ${!color ? 'bg-white/10 text-white/80' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </span>
  );
};

CardBadge.displayName = 'CardBadge';

// Card Footer Sub-component
const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => (
  <div
    className={`
      flex items-center justify-between pt-4 mt-4 border-t border-white/10
      ${className}
    `}
  >
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';

// Card Arrow (for linked cards)
const CardArrow: React.FC<{ color?: string }> = ({ color }) => {
  const style: React.CSSProperties = color
    ? {
        backgroundColor: `${color}20`,
        borderWidth: '1px',
        borderColor: `${color}40`,
        color: color,
      }
    : {};

  return (
    <div
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300 group-hover:scale-110
        ${!color ? 'bg-white/10 text-white' : ''}
      `}
      style={style}
      aria-hidden="true"
    >
      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
    </div>
  );
};

CardArrow.displayName = 'CardArrow';

// Export compound component
export {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardDescription,
  CardBadge,
  CardFooter,
  CardArrow,
};

export default Card;
