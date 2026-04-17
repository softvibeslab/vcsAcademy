/**
 * VCSA Pocket - Reusable UI Components
 * Based on STITCH_DESIGN_PROMPT.md specifications
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CommonStyles, Colors, Spacing, Typography } from '../../theme';

// ============== BUTTON COMPONENTS ==============

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 20, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 16, paddingHorizontal: 24 };
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: Colors.navy,
          borderWidth: 1,
          borderColor: Colors.navy,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.gold,
        };
      default:
        return {
          backgroundColor: Colors.gold,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline' && !disabled) return Colors.gold;
    if (variant === 'primary' && !disabled) return Colors.black;
    return Colors.textPrimary;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getSizeStyle(),
        getVariantStyle(),
        disabled && styles.buttonDisabled,
        fullWidth && styles.buttonFullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      {icon && <Text style={[styles.buttonIcon, { color: getTextColor() }]}>{icon}</Text>}
      <Text style={[styles.buttonText, { color: getTextColor() }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// ============== CARD COMPONENTS ==============

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'active' | 'success';
  padding?: number;
  style?: any;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = Spacing.padding.md,
  style,
  onPress,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'active':
        return CommonStyles.cardActive;
      case 'success':
        return CommonStyles.cardSuccess;
      default:
        return CommonStyles.card;
    }
  };

  const cardContent = (
    <View style={[getVariantStyle(), { padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={style}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

// ============== PROGRESS BAR COMPONENT ==============

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  showPercentage?: boolean;
  style?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = Colors.gold,
  showPercentage = false,
  style,
}) => {
  return (
    <View style={style}>
      <View
        style={[
          styles.progressContainer,
          { height, borderRadius: height / 2 },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
              height,
              borderRadius: height / 2,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  );
};

// ============== STAT CARD COMPONENT ==============

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  progress?: number;
  trend?: string;
  style?: any;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  progress,
  trend,
  style,
}) => {
  return (
    <View style={[styles.statCard, style]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {progress !== undefined && (
        <ProgressBar progress={progress} height={6} />
      )}
      {trend && (
        <Text style={styles.statTrend}>{trend}</Text>
      )}
    </View>
  );
};

// ============== BADGE COMPONENT ==============

interface BadgeProps {
  text: string;
  variant?: 'gold' | 'green' | 'blue' | 'gray';
  size?: 'small' | 'medium';
  style?: any;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'gold',
  size = 'medium',
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'green':
        return CommonStyles.badgeGreen;
      case 'blue':
        return CommonStyles.badgeBlue;
      case 'gray':
        return {
          backgroundColor: Colors.border,
          color: Colors.textSecondary,
        };
      default:
        return CommonStyles.badgeGold;
    }
  };

  return (
    <View style={[CommonStyles.badge, getVariantStyle(), style]}>
      <Text
        style={{
          fontSize: size === 'small' ? Typography.fontSize.small : Typography.fontSize.caption,
          fontWeight: Typography.fontWeight.medium,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

// ============== LOADING COMPONENT ==============

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = Colors.gold,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return undefined;
    }
  };

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={getSize()} color={color} />
    </View>
  );
};

// ============== SECTION HEADER COMPONENT ==============

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  style?: any;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  style,
}) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && (
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

// ============== STYLES ==============

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.borderRadius.md,
    flexDirection: 'row',
    gap: Spacing.s,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonFullWidth: {
    width: '100%',
  },

  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.bold,
  },

  buttonIcon: {
    fontSize: Typography.fontSize.h5,
  },

  progressContainer: {
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },

  progressFill: {
    backgroundColor: Colors.gold,
  },

  progressText: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },

  statCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.padding.md,
    alignItems: 'center',
  },

  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },

  statValue: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginVertical: Spacing.xs,
  },

  statLabel: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  statTrend: {
    fontSize: Typography.fontSize.small,
    color: Colors.success,
    marginTop: Spacing.xs,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.padding.xl,
  },

  sectionHeader: {
    marginBottom: Spacing.padding.md,
  },

  sectionIcon: {
    fontSize: Typography.fontSize.h3,
    marginRight: Spacing.s,
  },

  sectionTitle: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },

  sectionSubtitle: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
