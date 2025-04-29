import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import AppProvider from '../context/AppContext.js';
import { useAppContext } from '../context/AppContext.js';
import OnboardingScreen from '../components/Onboarding';
import { registerBackgroundTasks } from '../utils/backgroundTasks';
import * as Notifications from 'expo-notifications';
import LoginScreen from '../components/LoginScreen';
import ChildRegistration from '../components/ChildRegistration';
import ParentRegistration from '../components/ParentRegistration';
import ParentDashboard from '../components/ParentDashboard';
import PendingApproval from '../components/PendingApproval';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
      
      // Register background tasks when the app starts
      const setupTasks = async () => {
        await registerBackgroundTasks();
      };
      
      setupTasks();
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
  const {
    isFirstLaunch,
    loading,
    userType,
    userAccount,
    showAccessApproval,
    clearUserAccount,
    USER_TYPE,
    completeOnboarding
  } = useAppContext();
  
  const [showChildRegistration, setShowChildRegistration] = useState(false);
  const [showParentRegistration, setShowParentRegistration] = useState(false);

  // Auto-complete onboarding if it's the first launch
  useEffect(() => {
    if (isFirstLaunch && completeOnboarding) {
      completeOnboarding();
    }
  }, [isFirstLaunch, completeOnboarding]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B132B' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#3FFFA8" />
      </View>
    );
  }
  
  // Show child registration
  if (showChildRegistration) {
    return (
      <ChildRegistration 
        onBack={() => setShowChildRegistration(false)} 
        onComplete={() => setShowChildRegistration(false)}
      />
    );
  }
  
  // Show parent registration
  if (showParentRegistration) {
    return (
      <ParentRegistration 
        onBack={() => setShowParentRegistration(false)} 
        onComplete={() => setShowParentRegistration(false)} 
      />
    );
  }
  
  // Always show the login screen first for prototype
  // Skip checking userType === USER_TYPE.NONE condition
  if (!showChildRegistration && !showParentRegistration && !showAccessApproval && userType !== USER_TYPE.PARENT && !(userType === USER_TYPE.CHILD && !showAccessApproval)) {
    return (
      <LoginScreen 
        onChildLogin={() => setShowChildRegistration(true)}
        onParentLogin={() => setShowParentRegistration(true)}
      />
    );
  }
  
  // Child is waiting for parent approval
  if (userType === USER_TYPE.CHILD && showAccessApproval) {
    return <PendingApproval onLogout={clearUserAccount} />;
  }
  
  // User is a parent, show parent dashboard
  if (userType === USER_TYPE.PARENT) {
    return <ParentDashboard />;
  }
  
  // User is a child with approved account, show normal app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

// We no longer need this as we're auto-completing onboarding
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
