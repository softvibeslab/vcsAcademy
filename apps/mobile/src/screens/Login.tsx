import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { clearError, login } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../demo/data';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim() || isLoading) {
      return;
    }

    dispatch(clearError());
    await dispatch(
      login({
        email: email.trim(),
        password,
      })
    );
  };

  const handleDemoLogin = async () => {
    if (isLoading) {
      return;
    }

    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);

    dispatch(clearError());
    await dispatch(
      login({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.kicker}>VCSA Pocket</Text>
            <Text style={styles.title}>Sales coaching built for the floor</Text>
            <Text style={styles.subtitle}>
              Sign in to access AI coaching, readiness tracking, quick wins, and your daily action plan.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor="#64748B"
              style={styles.input}
              value={email}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#64748B"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#020204" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </Pressable>

            <Pressable onPress={handleDemoLogin} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Use Demo Credentials</Text>
            </Pressable>

            <Text style={styles.footnote}>
              For internal QA you can use demo@vcsa.com / demo123. Demo mode also works offline in Expo Go.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020204',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  hero: {
    gap: 12,
  },
  kicker: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: 14,
    borderWidth: 1,
    color: '#F8FAFC',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    marginTop: 8,
    paddingVertical: 16,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#020204',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  footnote: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
