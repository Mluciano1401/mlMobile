
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '@/hooks/AuthContext';
import { colors } from '@/components/UI';
import {
  AuthStackParamList,
  UsersStackParamList,
  MainTabParamList,
} from './types';

import LoginScreen from '@/views/auth/LoginScreen';
import RegisterScreen from '@/views/auth/RegisterScreen';
import DashboardScreen from '@/views/DashboardScreen';
import UsersListScreen from '@/views/users/UsersListScreen';
import UserFormScreen from '@/views/users/UserFormScreen';
import UploadScreen from '@/views/upload/UploadScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const UsersStack = createNativeStackNavigator<UsersStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function UsersNavigator() {
  return (
    <UsersStack.Navigator>
      <UsersStack.Screen
        name="UsersList"
        component={UsersListScreen}
        options={{ title: 'Usuarios' }}
      />
      <UsersStack.Screen
        name="UserForm"
        component={UserFormScreen}
        options={{ title: 'Usuario' }}
      />
    </UsersStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen
        name="UsersTab"
        component={UsersNavigator}
        options={{ title: 'Usuarios', headerShown: false }}
      />
      <Tabs.Screen
        name="Upload"
        component={UploadScreen}
        options={{ title: 'Subir' }}
      />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
