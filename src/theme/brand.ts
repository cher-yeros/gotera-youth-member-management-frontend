// Theme configuration for Gotera Youth Member Management
export const brandColors = {
  // Primary Blue Colors
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Primary blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Secondary Purple Colors
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Primary purple
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // Neutral Colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Semantic Colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },

  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },

  error: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },

  info: {
    50: "#eff6ff",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
};

// Brand-specific color mappings
export const brandTheme = {
  primary: brandColors.blue[500],
  primaryForeground: brandColors.blue[50],
  secondary: brandColors.purple[500],
  secondaryForeground: brandColors.purple[50],
  accent: brandColors.purple[100],
  accentForeground: brandColors.purple[900],
  muted: brandColors.neutral[100],
  mutedForeground: brandColors.neutral[600],
  background: brandColors.neutral[50],
  foreground: brandColors.neutral[900],
  card: "#ffffff",
  cardForeground: brandColors.neutral[900],
  border: brandColors.neutral[200],
  input: brandColors.neutral[200],
  ring: brandColors.blue[500],
  destructive: brandColors.error[500],
  destructiveForeground: "#ffffff",
};

// Dark theme variant
export const brandThemeDark = {
  primary: brandColors.blue[400],
  primaryForeground: brandColors.blue[950],
  secondary: brandColors.purple[400],
  secondaryForeground: brandColors.purple[950],
  accent: brandColors.purple[800],
  accentForeground: brandColors.purple[100],
  muted: brandColors.neutral[800],
  mutedForeground: brandColors.neutral[400],
  background: brandColors.neutral[950],
  foreground: brandColors.neutral[50],
  card: brandColors.neutral[900],
  cardForeground: brandColors.neutral[50],
  border: brandColors.neutral[800],
  input: brandColors.neutral[800],
  ring: brandColors.blue[400],
  destructive: brandColors.error[500],
  destructiveForeground: "#ffffff",
};

// Gradient combinations
export const gradients = {
  primary: `linear-gradient(135deg, ${brandColors.blue[500]} 0%, ${brandColors.purple[500]} 100%)`,
  secondary: `linear-gradient(135deg, ${brandColors.purple[400]} 0%, ${brandColors.blue[400]} 100%)`,
  subtle: `linear-gradient(135deg, ${brandColors.blue[50]} 0%, ${brandColors.purple[50]} 100%)`,
  dark: `linear-gradient(135deg, ${brandColors.blue[900]} 0%, ${brandColors.purple[900]} 100%)`,
};

// Brand-specific spacing and typography
export const brandSpacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
};

export const brandTypography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    display: ["Inter", "system-ui", "sans-serif"],
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Export theme object
export const goteraTheme = {
  colors: brandColors,
  theme: brandTheme,
  themeDark: brandThemeDark,
  gradients,
  spacing: brandSpacing,
  typography: brandTypography,
};
