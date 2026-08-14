import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function AboutScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable style={styles.headerAction} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            設定
          </ThemedText>
        </Pressable>

        <ThemedText
          type="subtitle"
          style={[styles.headerTitle, { color: theme.text }]}
        >
          アプリについて
        </ThemedText>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.centerMessage}>
        <ThemedText
          type="small"
          style={[styles.messageText, { color: theme.textSecondary }]}
        >
          アプリについては現在準備中です。公開までしばらくお待ち下さい。
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 58,
    marginHorizontal: -Spacing.five,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.five,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 86,
  },
  headerSpacer: {
    width: 86,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.seven,
    paddingBottom: 160,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
});
