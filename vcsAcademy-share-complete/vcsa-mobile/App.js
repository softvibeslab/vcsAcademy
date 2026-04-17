/**
 * VCSA Mobile - React Native Expo App
 * Enhanced with Authentication and Real API Integration
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TrainingScreen from './screens/TrainingScreen';
import CoachingScreen from './screens/CoachingScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import ProfileScreen from './screens/ProfileScreen';

// Services
import apiService from './services/api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Check if user is authenticated
const isUserAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  } catch (error) {
    return false;
  }
};

// Tab Navigator
function MainTabs({ route }) {
  // Get user params from route if needed
  const userData = route?.params?.userData;

  const handleRefresh = () => {
    // Force refresh of all screens
    navigationRef.current?.getRootState();
  };

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
function AppNavigator({ authenticated, setAuthenticated, userData }) {
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
      {!authenticated ? (
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
        >
          {props => (
            <LoginScreen
              {...props}
              onLoginSuccess={(user) => {
                setAuthenticated(true);
                // Navigate to Main after login
                navigationRef.current?.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { userData: user } }],
                });
              }}
            />
          )}
        />
      )}
      </Stack.Screen>
      ) : (
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
        >
          {props => <MainTabs {...props} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

// Create navigation ref
export const navigationRef = React.createRef();

// Custom Text Component
const Text = ({ children, style, ...props }) => {
  return (
    <RNText style={[{ color: '#e5e1e8' }, style]} {...props}>
      {children}
    </RNText>
  );
};

import { Text as RNText, View } from 'react-native';

// Main App Component
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    loadFonts();
    checkAuthentication();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
        'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.log('Error loading fonts:', error);
      setFontsLoaded(true); // Continue even if fonts fail
    }
  };

  const checkAuthentication = async () => {
    try {
      const isAuth = await isUserAuthenticated();
      setAuthenticated(isAuth);

      if (isAuth) {
        // Load user data
        const userStr = await AsyncStorage.getItem('user_data');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
        }
      }
    } catch (error) {
      console.log('Error checking authentication:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  if (!fontsLoaded || checkingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: '#131317', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f2ca50" />
        <Text style={{ color: '#d0c5af', marginTop: 10 }}>Loading VCSA...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="dark" />
      <AppNavigator
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
        userData={userData}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131317',
  },
});