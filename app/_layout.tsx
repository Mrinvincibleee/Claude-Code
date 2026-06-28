import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { palette } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.void }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.void },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="workout/[id]"
            options={{ animation: 'slide_from_right', presentation: 'card' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
