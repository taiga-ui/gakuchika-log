import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import {
  rehydrateApp,
  retryPersistence,
  usePersistenceStore,
} from "@/store/use-app-store";

export default function RootLayout() {
  const theme = useTheme();
  const hydrationStatus = usePersistenceStore((state) => state.hydrationStatus);
  const hydrationError = usePersistenceStore((state) => state.hydrationError);
  const persistenceError = usePersistenceStore(
    (state) => state.persistenceError,
  );
  const persistenceStatus = usePersistenceStore(
    (state) => state.persistenceStatus,
  );

  if (hydrationStatus === "loading") {
    return (
      <SafeAreaProvider>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={{ color: theme.textSecondary }}>
            保存データを復元しています…
          </ThemedText>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        {hydrationError ? (
          <View style={[styles.notice, { backgroundColor: theme.danger }]}>
            <ThemedText style={styles.noticeText}>
              保存データを復元できませんでした。再試行してください。
            </ThemedText>
            <Pressable onPress={rehydrateApp} accessibilityLabel="復元を再試行">
              <ThemedText style={styles.retryText}>再試行</ThemedText>
            </Pressable>
          </View>
        ) : persistenceError ? (
          <View style={[styles.notice, { backgroundColor: theme.danger }]}>
            <ThemedText style={styles.noticeText}>
              保存に失敗しました。もう一度保存してください。
            </ThemedText>
            <Pressable
              onPress={retryPersistence}
              accessibilityLabel="保存を再試行"
            >
              <ThemedText style={styles.retryText}>再試行</ThemedText>
            </Pressable>
          </View>
        ) : persistenceStatus === "saving" ? (
          <View style={[styles.notice, { backgroundColor: theme.primary }]}>
            <ThemedText style={styles.noticeText}>保存中です…</ThemedText>
          </View>
        ) : null}
        <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="activities/[id]" />
          <Stack.Screen
            name="activities/new"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="projects/new"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="projects/[id]" />
          <Stack.Screen name="gakuchika/index" />
          <Stack.Screen name="gakuchika/[id]" />
          <Stack.Screen name="es/index" />
          <Stack.Screen name="settings/index" />
          <Stack.Screen name="settings/profile" />
          <Stack.Screen name="settings/profile/[field]" />
          <Stack.Screen name="settings/notifications" />
          <Stack.Screen name="settings/export" />
          <Stack.Screen name="settings/help" />
          <Stack.Screen name="settings/about" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notice: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  noticeText: { color: "#FFFFFF", flex: 1 },
  retryText: { color: "#FFFFFF", fontWeight: "700" },
});
