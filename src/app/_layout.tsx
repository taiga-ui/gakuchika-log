import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="activities/[id]" />
          <Stack.Screen
            name="activities/new"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="gakuchika/index" />
          <Stack.Screen name="gakuchika/[id]" />
          <Stack.Screen name="es/index" />
          <Stack.Screen name="settings/index" />
          <Stack.Screen name="settings/profile" />
          <Stack.Screen name="settings/notifications" />
          <Stack.Screen name="settings/export" />
          <Stack.Screen name="settings/help" />
          <Stack.Screen name="settings/about" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
