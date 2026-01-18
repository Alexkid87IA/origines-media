// src/styles/tokens.ts
// Design System Tokens - Origines Media

// ===================
// COLORS
// ===================
export const colors = {
  // Primary palette
  primary: {
    violet: '#8B5CF6',
    purple: '#A855F7',
    pink: '#EC4899',
    fuchsia: '#D946EF',
  },

  // Accent colors (for formats/categories)
  accent: {
    orange: '#F59E0B',
    amber: '#FBBF24',
    emerald: '#10B981',
    teal: '#14B8A6',
    cyan: '#06B6D4',
    blue: '#3B82F6',
    indigo: '#6366F1',
    red: '#EF4444',
    rose: '#F43F5E',
  },

  // Neutral palette
  neutral: {
    black: '#0A0A0A',
    darkGray: '#0F0F0F',
    gray: '#1A1A1A',
    lightGray: '#2A2A2A',
    white: '#F5F5F5',
  },

  // Semantic colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Format/Verticale colors
  formats: {
    'la-lettre': '#8B5CF6',
    'secrets-pro': '#EC4899',
    'il-etait-une-fois': '#F59E0B',
    'connexion': '#10B981',
    'transmission': '#3B82F6',
    'etat-esprit': '#EF4444',
    'apparence': '#8B5CF6',
    'je-suis': '#06B6D4',
  },

  verticales: {
    'culture': '#8B5CF6',
    'business': '#10B981',
    'lifestyle': '#EC4899',
    'tech': '#3B82F6',
    'sport': '#F59E0B',
    'science': '#06B6D4',
    'art': '#D946EF',
    'musique': '#EF4444',
    'cinema': '#F43F5E',
    'litterature': '#A855F7',
  },
} as const

// ===================
// TYPOGRAPHY
// ===================
export const typography = {
  fontFamily: {
    heading: '"Montserrat", sans-serif',
    body: '"Inter", sans-serif',
  },

  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    ultrawide: '0.2em',
    extreme: '0.3em',
  },
} as const

// ===================
// SPACING
// ===================
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const

// ===================
// ANIMATION
// ===================
export const animation = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
    // For reduced motion
    reduced: '0.01ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom easings
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  // Carousel/slideshow timings
  slideshow: {
    slideDuration: 8000,  // 8 seconds per slide
    transitionDuration: 600,
  },
} as const

// ===================
// OPACITY (Standardized)
// ===================
export const opacity = {
  // For text on dark backgrounds
  text: {
    muted: 0.5,      // Secondary text, less important
    medium: 0.7,     // Normal text
    high: 0.85,      // Important text
    full: 1,         // Primary text, headings
  },

  // For backgrounds/overlays
  background: {
    subtle: 0.05,
    light: 0.1,
    medium: 0.2,
    heavy: 0.4,
    overlay: 0.6,
    dark: 0.8,
  },

  // For borders
  border: {
    subtle: 0.1,
    light: 0.2,
    medium: 0.3,
    visible: 0.4,
  },
} as const

// ===================
// SHADOWS
// ===================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glow: {
    violet: '0 0 20px rgba(139, 92, 246, 0.3)',
    pink: '0 0 20px rgba(236, 72, 153, 0.3)',
    blue: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
} as const

// ===================
// BORDER RADIUS
// ===================
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// ===================
// BREAKPOINTS
// ===================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ===================
// Z-INDEX
// ===================
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  fixed: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  tooltip: 80,
  toast: 90,
  max: 100,
} as const

// ===================
// LAYOUT
// ===================
export const layout = {
  sidebar: {
    width: '280px',
    collapsedWidth: '80px',
  },
  container: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '7xl': '80rem',
    },
  },
  card: {
    width: {
      sm: '280px',
      md: '320px',
      lg: '350px',
      xl: '400px',
    },
  },
} as const

// ===================
// CSS VARIABLES EXPORT
// ===================
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${colors.primary.violet};
    --color-primary-purple: ${colors.primary.purple};
    --color-primary-pink: ${colors.primary.pink};
    --color-primary-fuchsia: ${colors.primary.fuchsia};

    --color-bg-primary: ${colors.neutral.black};
    --color-bg-secondary: ${colors.neutral.darkGray};
    --color-bg-tertiary: ${colors.neutral.gray};
    --color-text-primary: ${colors.neutral.white};

    /* Animation */
    --duration-fast: ${animation.duration.fast};
    --duration-normal: ${animation.duration.normal};
    --duration-slow: ${animation.duration.slow};
    --duration-slower: ${animation.duration.slower};

    --easing-default: ${animation.easing.easeInOut};
    --easing-bounce: ${animation.easing.bounce};

    /* Spacing */
    --sidebar-width: ${layout.sidebar.width};

    /* Opacity */
    --opacity-text-muted: ${opacity.text.muted};
    --opacity-text-medium: ${opacity.text.medium};
    --opacity-text-high: ${opacity.text.high};

    /* Border radius */
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    --radius-2xl: ${borderRadius['2xl']};
    --radius-full: ${borderRadius.full};
  }
`

// ===================
// HELPER FUNCTIONS
// ===================

/**
 * Get color with opacity
 */
export function colorWithOpacity(hexColor: string, opacity: number): string {
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0')
  return `${hexColor}${alpha}`
}

/**
 * Get format color by slug
 */
export function getFormatColor(formatSlug: string): string {
  return colors.formats[formatSlug as keyof typeof colors.formats] || colors.primary.violet
}

/**
 * Get verticale color by slug
 */
export function getVerticaleColor(verticaleSlug: string): string {
  return colors.verticales[verticaleSlug as keyof typeof colors.verticales] || colors.primary.violet
}

// Export all tokens as default
const tokens = {
  colors,
  typography,
  spacing,
  animation,
  opacity,
  shadows,
  borderRadius,
  breakpoints,
  zIndex,
  layout,
}

export default tokens
