// src/components/ui/IconButton.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  'aria-label': string; // Required for accessibility
  variant?: 'default' | 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  isActive?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      'aria-label': ariaLabel,
      variant = 'default',
      size = 'md',
      color,
      isActive = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Size configurations
    const sizeConfig = {
      sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
      md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
      lg: { button: 'w-12 h-12', icon: 'w-6 h-6' },
      xl: { button: 'w-14 h-14', icon: 'w-7 h-7' },
    };

    // Variant styles
    const getVariantClasses = () => {
      const baseClasses = 'inline-flex items-center justify-center rounded-full transition-all duration-300';

      switch (variant) {
        case 'default':
          return `${baseClasses} border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:border-white/40 hover:bg-white/10`;
        case 'ghost':
          return `${baseClasses} text-white/70 hover:text-white hover:bg-white/10`;
        case 'outline':
          return `${baseClasses} border-2 bg-transparent hover:bg-opacity-10`;
        case 'solid':
          return `${baseClasses} text-white hover:opacity-90`;
        default:
          return baseClasses;
      }
    };

    // Dynamic styles
    const getStyles = (): React.CSSProperties => {
      const styles: React.CSSProperties = {};

      if (color) {
        switch (variant) {
          case 'outline':
            styles.borderColor = color;
            styles.color = color;
            break;
          case 'solid':
            styles.backgroundColor = `${color}20`;
            styles.borderWidth = '1px';
            styles.borderColor = `${color}40`;
            styles.color = color;
            break;
        }
      }

      return styles;
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={isActive}
        className={`
          ${getVariantClasses()}
          ${sizeConfig[size].button}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isActive ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''}
          ${className}
        `}
        style={getStyles()}
        {...props}
      >
        <Icon className={sizeConfig[size].icon} aria-hidden="true" />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
