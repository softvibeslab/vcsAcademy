import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const getButtonStyles = () => {
    const baseStyles = [styles.button];

    switch (variant) {
      case 'primary':
        return [...baseStyles, styles.primary];
      case 'secondary':
        return [...baseStyles, styles.secondary];
      case 'outline':
        return [...baseStyles, styles.outline];
      case 'ghost':
        return [...baseStyles, styles.ghost];
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#020204" />
      ) : (
        <>
          {icon && <Ionicons name={icon as any} size={20} color={variant === 'outline' || variant === 'ghost' ? '#F1F5F9' : '#020204'} />}
          <Text style={[styles.text, (variant === 'outline' || variant === 'ghost') && styles.textOutline]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  primary: {
    backgroundColor: '#D4AF37',
  },
  secondary: {
    backgroundColor: '#3B82F6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020204',
  },
  textOutline: {
    color: '#F1F5F9',
  },
  icon: {
    marginRight: 8,
  },
});
