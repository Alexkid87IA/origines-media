// src/components/ui/index.ts
// Centralized exports for all UI components

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { default as Badge } from './Badge';
export type { BadgeProps } from './Badge';

export {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardDescription,
  CardBadge,
  CardFooter,
  CardArrow,
} from './Card';
export type {
  CardProps,
  CardImageProps,
  CardContentProps,
  CardTitleProps,
  CardDescriptionProps,
  CardBadgeProps,
  CardFooterProps,
} from './Card';

export { default as OptimizedImage } from './OptimizedImage';
export type { OptimizedImageProps } from './OptimizedImage';
