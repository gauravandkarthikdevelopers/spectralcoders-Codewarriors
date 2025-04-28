import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import AppProvider from '../context/AppContext.js';
import { useAppContext } from '../context/AppContext.js';
import OnboardingScreen from '../components/Onboarding';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add your fonts here if needed
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B132B' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#3FFFA8" />
        <Text style={{ color: 'white', marginTop: 20 }}>Loading app...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <RootContent />
    </AppProvider>
  );
}

function RootContent() {
  const context = useAppContext();
  const { isFirstLaunch, loading } = context || {};

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B132B' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#3FFFA8" />
      </View>
    );
  }

  if (isFirstLaunch) {
    return <OnboardingFlow />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

function OnboardingFlow() {
  const context = useAppContext();
  const { completeOnboarding } = context || {};
  
  const handleOnboardingComplete = () => {
    if (completeOnboarding) {
      completeOnboarding();
    }
  };

  return (
    <OnboardingScreen onComplete={handleOnboardingComplete} />
  );
}
