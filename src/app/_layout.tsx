import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="activities/[id]" />
          <Stack.Screen
            name="activities/new"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="gakuchika/index" />
          <Stack.Screen name="gakuchika/[id]" />
          <Stack.Screen name="es/index" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
