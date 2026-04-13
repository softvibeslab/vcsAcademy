/**
 * VCSA Mobile - React Native Expo App
 * Preview APK for Android
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import { AppLoading } from 'expo-app-loading';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import TrainingScreen from './screens/TrainingScreen';
import CoachingScreen from './screens/CoachingScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import ProfileScreen from './screens/ProfileScreen';

// API
const API = 'http://10.0.2.2:8000/api'; // Para Android emulator

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#131317',
          borderTopColor: '#4d4635',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 5
        },
        tabBarActiveTintColor: '#f2ca50',
        tabBarInactiveTintColor: '#d0c5af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          tabBarLabel: 'Training',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="school" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Coaching"
        component={CoachingScreen}
        options={{
          tabBarLabel: 'Coaching',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="groups" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarLabel: 'Resources',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="folder" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

// Simple Tab Icon (using emoji for now, in production use icons)
function TabIcon({ name, color, size }) {
  const icons = {
    home: '🏠',
    school: '📚',
    groups: '👥',
    folder: '📁',
    person: '👤'
  };

  return (
    <Text style={{ fontSize: size || 24, color }}>
      {icons[name] || '📱'}
    </Text>
  );
}

// Stack Navigator
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#131317',
        },
        headerTintColor: '#f2ca50',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Custom Text Component
const Text = ({ children, style, ...props }) => {
  return (
    <RNText style={[{ color: '#e5e1e8' }, style]} {...props}>
      {children}
    </RNText>
  );
};

import { Text as RNText, View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Main App Component
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
      'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131317',
  },
});
