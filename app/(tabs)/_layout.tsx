import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3FFFA8',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#0B132B',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
      tabBarBackground={() => <TabBarBackground />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <MaterialIcons name="home" size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <MaterialIcons name="school" size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <MaterialIcons name="today" size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <MaterialIcons name="explore" size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Badges',
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <MaterialIcons name="emoji-events" size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <HapticTab>
              <MaterialIcons name="person" size={24} color={color} />
            </HapticTab>
          ),
        }}
      />
    </Tabs>
  );
}
