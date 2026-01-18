// src/components/ui/Button.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { colors } from '../../styles/tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient' | 'cta' | 'cta-outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  /** Ajoute automatiquement une flèche → à droite */
  withArrow?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  /** Pour rendre comme un lien */
  as?: 'button' | 'a' | 'link';
  href?: string;
  to?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      color = colors.primary.violet,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      withArrow = false,
      isLoading = false,
      fullWidth = false,
      as = 'button',
      href,
      to,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Size classes - CTA variants ont des paddings plus généreux
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-3',
    };

    // Sizes spécifiques pour les variantes CTA
    const ctaSizeClasses = {
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-6 py-3 text-sm gap-2',
      lg: 'px-8 py-4 text-base gap-3',
      xl: 'px-10 py-5 text-lg gap-3',
    };

    // Icon sizes
    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const isCta = variant === 'cta' || variant === 'cta-outline';

    // Variant styles
    const getVariantClasses = () => {
      const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300';
      const roundedClasses = isCta ? 'rounded-full' : 'rounded-xl';

      switch (variant) {
        case 'primary':
          return `${baseClasses} ${roundedClasses} text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]`;
        case 'secondary':
          return `${baseClasses} ${roundedClasses} bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30`;
        case 'ghost':
          return `${baseClasses} ${roundedClasses} text-white/80 hover:text-white hover:bg-white/10`;
        case 'outline':
          return `${baseClasses} ${roundedClasses} bg-transparent border-2 hover:bg-opacity-10`;
        case 'gradient':
          return `${baseClasses} ${roundedClasses} bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-500 hover:to-pink-500 hover:scale-[1.02] active:scale-[0.98]`;
        // Nouvelles variantes CTA harmonisées
        case 'cta':
          return `${baseClasses} ${roundedClasses} font-bold text-white hover:scale-105 active:scale-[0.98]`;
        case 'cta-outline':
          return `${baseClasses} ${roundedClasses} font-bold border-2 backdrop-blur-sm hover:scale-105 active:scale-[0.98]`;
        default:
          return `${baseClasses} ${roundedClasses}`;
      }
    };

    // Dynamic styles for colored variants
    const getColorStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return { backgroundColor: color };
        case 'outline':
          return { borderColor: color, color: color };
        case 'cta':
          return {
            backgroundColor: color,
            boxShadow: `0 10px 30px ${color}40`
          };
        case 'cta-outline':
          return {
            borderColor: `${color}80`,
            color: 'white',
            backgroundColor: `${color}15`,
            boxShadow: `0 10px 30px ${color}20`
          };
        default:
          return {};
      }
    };

    const isDisabled = disabled || isLoading;
    const currentSizeClasses = isCta ? ctaSizeClasses[size] : sizeClasses[size];

    // Détermine l'icône de droite : RightIcon ou flèche si withArrow
    const FinalRightIcon = RightIcon || (withArrow ? ArrowRight : null);

    const buttonClasses = `
      ${getVariantClasses()}
      ${currentSizeClasses}
      ${fullWidth ? 'w-full' : ''}
      ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    const content = (
      <>
        {isLoading ? (
          <svg
            className={`animate-spin ${iconSizes[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : LeftIcon ? (
          <LeftIcon className={iconSizes[size]} aria-hidden="true" />
        ) : null}

        <span>{children}</span>

        {FinalRightIcon && !isLoading && (
          <FinalRightIcon
            className={`${iconSizes[size]} ${withArrow ? 'group-hover:translate-x-1 transition-transform' : ''}`}
            aria-hidden="true"
          />
        )}
      </>
    );

    // Rendu comme Link de React Router
    if (as === 'link' && to) {
      return (
        <Link
          to={to}
          className={`group ${buttonClasses}`}
          style={getColorStyles()}
        >
          {content}
        </Link>
      );
    }

    // Rendu comme balise <a>
    if (as === 'a' && href) {
      return (
        <a
          href={href}
          className={`group ${buttonClasses}`}
          style={getColorStyles()}
        >
          {content}
        </a>
      );
    }

    // Rendu comme bouton par défaut
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`group ${buttonClasses}`}
        style={getColorStyles()}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
