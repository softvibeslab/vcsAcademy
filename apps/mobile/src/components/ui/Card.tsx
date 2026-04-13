import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  padding?: 'none' | 'small' | 'medium' | 'large';
  icon?: string;
  iconColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'medium',
  icon,
  iconColor = '#D4AF37',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      case 'error':
        return styles.error;
      default:
        return styles.default;
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: 12 };
      case 'large':
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        getPaddingStyles(),
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  default: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  primary: {
    backgroundColor: '#1E293B',
    borderColor: '#D4AF37',
  },
  secondary: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
  },
  success: {
    backgroundColor: '#1E293B',
    borderColor: '#22c55e',
  },
  warning: {
    backgroundColor: '#1E293B',
    borderColor: '#F59E0B',
  },
  error: {
    backgroundColor: '#1E293B',
    borderColor: '#EF4444',
  },
  iconContainer: {
    marginBottom: 12,
  },
});
