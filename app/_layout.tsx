import {
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";

import { SessionProvider, useSession } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(app)",
};

const queryClient = new QueryClient();
export default function RootLayout() {

  return (
    <SessionProvider>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="auto" />
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session, profile, isInitializing, isLoading } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={isInitializing || isLoading}>
        <Stack.Screen name="(auth)/loader" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!session && !profile}>
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/enter-otp" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={session !== null && profile === null}>
        <Stack.Screen name="(auth)/setup-profile" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!session && !!profile}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
