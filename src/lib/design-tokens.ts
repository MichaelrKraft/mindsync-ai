// MindSync Design System Tokens
// Based on the established style guide for clean, Notion-inspired aesthetics

export const colors = {
  // Primary Colors
  primary: {
    white: '#FFFFFF',
    gray: '#37352F',
  },
  
  // Secondary Colors
  secondary: {
    grayLight: '#787774',
    grayPale: '#F7F6F3',
  },
  
  // Accent Colors
  accent: {
    blue: '#2383E2',
    blueLight: '#EBF3FD',
  },
  
  // Functional Colors
  functional: {
    success: '#0F7B0F',
    warning: '#FF8C00',
    error: '#E03E3E',
    backgroundLight: '#FAFAFA',
  },
  
  // Border and Divider Colors
  border: {
    light: '#E6E6E3',
    medium: '#D3D1CB',
  }
} as const

export const typography = {
  // Font Families
  fonts: {
    primary: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Fira Code', 'monospace'],
  },
  
  // Font Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Text Styles
  styles: {
    // Headings
    h1: {
      fontSize: '32px',
      lineHeight: '40px',
      letterSpacing: '-0.3px',
      fontWeight: 700,
    },
    h2: {
      fontSize: '24px',
      lineHeight: '32px',
      letterSpacing: '-0.2px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '18px',
      lineHeight: '24px',
      letterSpacing: '-0.1px',
      fontWeight: 500,
    },
    
    // Body Text
    bodyLarge: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
    },
    body: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
    },
    bodySmall: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
    },
    
    // Special Text
    button: {
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.1px',
      fontWeight: 500,
    },
    caption: {
      fontSize: '11px',
      lineHeight: '16px',
      letterSpacing: '0.3px',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
    },
    link: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
      color: colors.accent.blue,
    },
  },
} as const

export const spacing = {
  // Micro spacing
  xs: '4px',   // 1
  sm: '8px',   // 2
  md: '12px',  // 3
  lg: '16px',  // 4
  xl: '24px',  // 6
  '2xl': '32px', // 8
  
  // Component-specific spacing
  component: {
    cardPadding: '16px',
    buttonPaddingX: '12px',
    buttonPaddingY: '8px',
    inputHeight: '40px',
    sectionGap: '24px',
    pageMargin: '32px',
  },
} as const

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
  
  // Component-specific
  component: {
    card: '8px',
    button: '6px',
    input: '6px',
    searchBar: '22px', // Fully rounded
  },
} as const

export const shadows = {
  // Subtle shadows for depth
  card: '0 1px 3px rgba(0, 0, 0, 0.1)',
  cardHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
  dialog: '0 8px 32px rgba(0, 0, 0, 0.2)',
  none: 'none',
} as const

export const animation = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '350ms',
  },
  
  // Easing curves
  easing: {
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Icon sizes
export const icons = {
  sizes: {
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '28px',
  },
  
  colors: {
    primary: colors.primary.gray,
    secondary: colors.secondary.grayLight,
    accent: colors.accent.blue,
  },
} as const

// Layout constants
export const layout = {
  sidebar: {
    width: '240px',
    collapsedWidth: '64px',
  },
  
  header: {
    height: '64px',
  },
  
  content: {
    maxWidth: '1200px',
    padding: '24px',
  },
} as const