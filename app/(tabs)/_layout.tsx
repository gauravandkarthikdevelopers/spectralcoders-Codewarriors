import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import index from './index';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 0,
        },
        headerShown: false,
      }}
      tabBarBackground={() => <TabBarBackground />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <IconSymbol name="home" color={color} />
            </HapticTab>
          ),
        }}
      />
    </Tabs>
  );
}</HapticTab>
