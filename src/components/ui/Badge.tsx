// src/components/ui/Badge.tsx
import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'solid' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  color,
  className = '',
  children,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  // Variant base classes (without color)
  const variantBaseClasses = {
    default: 'bg-white/10 text-white/80',
    solid: '',
    outline: 'bg-transparent border',
    subtle: '',
  };

  // Get dynamic styles based on color
  const getStyles = (): React.CSSProperties => {
    if (!color) return {};

    switch (variant) {
      case 'solid':
        return {
          backgroundColor: color,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          borderColor: color,
          color: color,
        };
      case 'subtle':
        return {
          backgroundColor: `${color}20`,
          color: color,
        };
      default:
        return {};
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-bold uppercase tracking-wider rounded-full
        ${sizeClasses[size]}
        ${variantBaseClasses[variant]}
        ${className}
      `}
      style={getStyles()}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
