import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activities = useAppStore((state) => state.activities);

  const recentActivities = activities.slice(0, 3);
  const recentRecords = recentActivities.map((activity, index) => ({
    category: activity.categoryKey,
    title: activity.title,
    body: activity.body,
    icon: (index === 0
      ? "sparkles"
      : index === 1
        ? "rocket"
        : "briefcase") as keyof typeof Ionicons.glyphMap,
  }));

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.brandWrap}>
          <View style={[styles.avatar, { backgroundColor: "#D8D4CF" }]}>
            <ThemedText type="smallBold" style={{ color: "#4E4B46" }}>
              田
            </ThemedText>
          </View>
          <ThemedText
            type="smallBold"
            style={[styles.brandText, { color: theme.primary }]}
          >
            ガクチカログ
          </ThemedText>
        </View>

        <Pressable
          style={[styles.settingsButton, { backgroundColor: theme.surface }]}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="settings-outline" size={28} color={theme.primary} />
        </Pressable>
      </View>

      <View style={styles.heroSection}>
        <ThemedText
          type="title"
          style={[styles.heroTitle, { color: theme.text }]}
        >
          大学生活の経験を残そう。
        </ThemedText>
        <ThemedText
          type="default"
          style={[styles.heroSubtitle, { color: theme.textSecondary }]}
        >
          日々の小さな活動が、将来の大きな力になります。
        </ThemedText>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: "#0B7A57" }]}
          onPress={() => router.push("/activities/new")}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
          <ThemedText type="smallBold" style={styles.primaryButtonText}>
            今日の活動を記録
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          最近の記録
        </ThemedText>

        {recentRecords.map((item, index) => (
          <Pressable
            key={`${item.category}-${index}`}
            style={[styles.recordCard, { backgroundColor: theme.surface }]}
            onPress={() => router.push("/activities")}
          >
            <View style={styles.recordHeader}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: theme.surfaceMuted },
                ]}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {item.category}
                </ThemedText>
              </View>
              <Ionicons
                name={item.icon as any}
                size={26}
                color={theme.textTertiary}
              />
            </View>

            <ThemedText
              type="subtitle"
              style={[styles.recordTitle, { color: theme.text }]}
            >
              {item.title}
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.recordBody, { color: theme.textSecondary }]}
            >
              {item.body}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.seven,
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  brandText: {
    fontSize: 18,
    lineHeight: 26,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  heroSection: {
    marginBottom: Spacing.seven,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 56,
    fontWeight: "700",
    marginBottom: Spacing.one,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 28,
    marginBottom: Spacing.four,
  },
  primaryButton: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 26,
  },
  section: {
    marginBottom: Spacing.seven,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: Spacing.three,
  },
  recordCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.three,
    gap: 12,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  recordTitle: {
    fontSize: 20,
    lineHeight: 34,
    fontWeight: "700",
  },
  recordBody: {
    fontSize: 15,
    lineHeight: 24,
  },
});
