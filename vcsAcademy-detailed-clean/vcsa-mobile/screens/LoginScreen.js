/**
 * Login Screen - VCSA Mobile
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiService from '../services/api';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('demo@vcsa.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const result = await apiService.login(email, password);

      if (result.success) {
        // Login exitoso
        Alert.alert('Success', `Welcome back, ${result.user.name}!`, [
          {
            text: 'OK',
            onPress: () => {
              if (onLoginSuccess) {
                onLoginSuccess(result.user);
              } else {
                navigation.navigate('Main');
              }
            }
          }
        ]);
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@vcsa.com');
    setPassword('demo123');
    // Auto-login con demo user
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con gradiente */}
        <LinearGradient
          colors={['#f2ca50', '#d4af37']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>VCSA</Text>
          <Text style={styles.headerSubtitle}>Vacation Club Sales Academy</Text>
          <Text style={styles.headerDesc}>Your Performance Operating System</Text>
        </LinearGradient>

        {/* Login form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to access your training</Text>

          {/* Email input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#6b6b76"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#6b6b76"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#3c2f00" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo login button */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoLogin}
            disabled={loading}
          >
            <Text style={styles.demoButtonText}>🚀 Quick Demo Login</Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Demo credentials info */}
          <View style={styles.demoInfo}>
            <Text style={styles.demoInfoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoInfoText}>Email: demo@vcsa.com</Text>
            <Text style={styles.demoInfoText}>Password: demo123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131317',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3c2f00',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#554300',
    fontWeight: '600',
    marginBottom: 5,
  },
  headerDesc: {
    fontSize: 14,
    color: '#664300',
    textAlign: 'center',
  },
  formContainer: {
    padding: 30,
    paddingTop: 10,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d0c5af',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#e5e1e8',
    borderWidth: 1,
    borderColor: '#353439',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#353439',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  eyeText: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#f2ca50',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#f2ca50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: '#9a8a5a',
  },
  loginButtonText: {
    color: '#3c2f00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f2ca50',
    marginBottom: 20,
  },
  demoButtonText: {
    color: '#f2ca50',
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  registerLink: {
    color: '#f2ca50',
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f2ca50',
  },
  demoInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f2ca50',
    marginBottom: 5,
  },
  demoInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
});
