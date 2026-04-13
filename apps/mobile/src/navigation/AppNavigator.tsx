import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

import { RootStackParamList } from '../types';
import { useAppSelector } from '../store/hooks';

// Screens (will create next)
import DashboardScreen from '../screens/Dashboard';
import PreTourModeScreen from '../screens/PreTourMode';
import AICoachChatScreen from '../screens/AICoachChat';
import QuickWinsLibraryScreen from '../screens/QuickWinsLibrary';
import PostTourDebriefScreen from '../screens/PostTourDebrief';
import GoalSheetScreen from '../screens/GoalSheetScreen';
import PlayRoleScreen from '../screens/PlayRoleScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#94A3B8',
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
        name="PreTourMode"
        component={PreTourModeScreen}
        options={{
          tabBarLabel: 'Pre-Tour',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AICoachChat"
        component={AICoachChatScreen}
        options={{
          tabBarLabel: 'AI Coach',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QuickWinsLibrary"
        component={QuickWinsLibraryScreen}
        options={{
          tabBarLabel: 'Quick Wins',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PostTourDebrief"
        component={PostTourDebriefScreen}
        options={{
          tabBarLabel: 'Debrief',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GoalSheet"
        component={GoalSheetScreen}
        options={{
          tabBarLabel: 'Goals',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PlayRole"
        component={PlayRoleScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    // TODO: Show Login screen
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#020204',
        },
        headerTintColor: '#F1F5F9',
        headerTitleStyle: {
          fontFamily: 'Playfair Display',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
