/**
 * VCSA Pocket - Design System
 * Dark Luxury Premium Theme
 * Based on specifications from STITCH_DESIGN_PROMPT.md
 */

// ============== COLOR PALETTE ==============
export const Colors = {
  // Primary Colors
  black: '#020204',
  navy: '#1E3A8A',
  card: '#1E293B',
  border: '#334155',

  // Accent Colors
  gold: '#D4AF37',
  goldLight: '#F5D77A',
  goldDark: '#B8941F',

  // Status Colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text Colors
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Category Colors
  mindset: '#A855F7',
  objections: '#EF4444',
  closing: '#22C55E',
  presentation: '#3B82F6',
  storytelling: '#F97316',

  // Difficulty Colors (Play Role)
  easy: '#22C55E',
  medium: '#F59E0B',
  hard: '#EF4444',
  expert: '#A855F7',

  // Score Colors (Play Role)
  excellent: '#D4AF37', // 9-10
  good: '#22C55E',      // 7-8
  fair: '#F59E0B',      // 5-6
  poor: '#EF4444',      // 0-4

  // Gradients
  goldGradient: ['#D4AF37', '#1E3A8A'],
  successGradient: ['#22C55E', '#16A34A'],
};

// ============== TYPOGRAPHY ==============
export const Typography = {
  // Font Family
  fontFamily: {
    heading: 'DMSans-Bold',
    body: 'DMSans-Regular',
    mono: 'DMSans-Medium',
  },

  // Font Sizes
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,
    body: 16,
    caption: 14,
    small: 12,
  },

  // Font Weights
  fontWeight: {
    bold: '700' as const,
    semiBold: '600' as const,
    medium: '500' as const,
    regular: '400' as const,
  },

  // Line Heights
  lineHeight: {
    h1: 38,
    h2: 31,
    h3: 28,
    h4: 25,
    h5: 22,
    h6: 20,
    body: 24,
    caption: 20,
    small: 16,
  },
};

// ============== SPACING ==============
export const Spacing = {
  xs: 4,
  s: 8,
  sm: 8,
  m: 16,
  md: 16,
  l: 24,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Padding presets
  padding: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  // Margin presets
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
};

// ============== SHADOWS ==============
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  goldGlow: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
};

// ============== ANIMATIONS ==============
export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// ============== COMMON STYLES ==============
export const CommonStyles = {
  // Card Styles
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.padding.md,
    ...Shadows.small,
  },

  cardActive: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.padding.md,
    ...Shadows.goldGlow,
  },

  cardSuccess: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.padding.md,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  // Button Styles
  buttonPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: Spacing.padding.md,
    paddingHorizontal: Spacing.padding.xl,
    ...Shadows.medium,
  },

  buttonSecondary: {
    backgroundColor: Colors.navy,
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: Spacing.padding.md,
    paddingHorizontal: Spacing.padding.xl,
    borderWidth: 1,
    borderColor: Colors.navy,
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: Spacing.borderRadius.md,
    paddingVertical: Spacing.padding.md,
    paddingHorizontal: Spacing.padding.xl,
    borderWidth: 1,
    borderColor: Colors.gold,
  },

  // Text Styles
  textH1: {
    fontSize: Typography.fontSize.h1,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.h1,
    color: Colors.textPrimary,
  },

  textH2: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.h2,
    color: Colors.textPrimary,
  },

  textH3: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.h3,
    color: Colors.textPrimary,
  },

  body: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.body,
    color: Colors.textSecondary,
  },

  caption: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.caption,
    color: Colors.textMuted,
  },

  // Input Styles
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.padding.md,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },

  inputFocused: {
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: Colors.gold,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.padding.md,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },

  // Progress Bar Styles
  progressBarBackground: {
    backgroundColor: Colors.border,
    borderRadius: Spacing.borderRadius.sm,
    height: 8,
  },

  progressBarFill: (progress = 0) => ({
    backgroundColor: Colors.gold,
    borderRadius: Spacing.borderRadius.sm,
    height: 8,
    width: `${progress * 100}%`,
  }),

  // Badge Styles
  badge: {
    paddingHorizontal: Spacing.padding.sm,
    paddingVertical: Spacing.padding.xs,
    borderRadius: Spacing.borderRadius.full,
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.medium,
    overflow: 'hidden',
  },

  badgeGold: {
    backgroundColor: Colors.gold,
    color: Colors.black,
  },

  badgeGreen: {
    backgroundColor: Colors.success,
    color: Colors.black,
  },

  badgeBlue: {
    backgroundColor: Colors.info,
    color: Colors.textPrimary,
  },

  // Header Styles
  header: {
    paddingHorizontal: Spacing.padding.md,
    paddingVertical: Spacing.padding.sm,
    backgroundColor: Colors.black,
  },

  headerTitle: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },

  headerSubtitle: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  Shadows,
  Animations,
  CommonStyles,
};
