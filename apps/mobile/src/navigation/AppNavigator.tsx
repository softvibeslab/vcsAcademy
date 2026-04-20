import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { MainTabParamList, RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreSession } from '../store/slices/authSlice';

import DashboardScreen from '../screens/Dashboard';
import PreTourModeScreen from '../screens/PreTourMode';
import AICoachChatScreen from '../screens/AICoachChat';
import QuickWinsLibraryScreen from '../screens/QuickWinsLibrary';
import PostTourDebriefScreen from '../screens/PostTourDebrief';
import GoalSheetScreen from '../screens/GoalSheetScreen';
import PlayRoleScreen from '../screens/PlayRoleScreen';
import LoginScreen from '../screens/Login';
import MoreHubScreen from '../screens/MoreHub';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 66 : 84,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'android' ? 8 : 24,
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AICoachChat"
        component={AICoachChatScreen}
        options={{
          tabBarLabel: 'Coach',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QuickWinsLibrary"
        component={QuickWinsLibraryScreen}
        options={{
          tabBarLabel: 'Library',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MoreHub"
        component={MoreHubScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const { hasRestoredSession, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!hasRestoredSession) {
      dispatch(restoreSession());
    }
  }, [dispatch, hasRestoredSession]);

  if (!hasRestoredSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>
          {isLoading ? 'Restoring session...' : 'Preparing app...'}
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#020204',
        },
        headerTintColor: '#F1F5F9',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PreTourMode"
            component={PreTourModeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PostTourDebrief"
            component={PostTourDebriefScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GoalSheet"
            component={GoalSheetScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PlayRole"
            component={PlayRoleScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#020204',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 15,
  },
});
