import {
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { SessionProvider, useSession } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "(app)",
};

export default function RootLayout() {

  return (
    <SessionProvider>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="auto" />
        <RootNavigator />
      </ThemeProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session, profile } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!session || !profile}>
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!session && !!profile}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="setup-profile" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
