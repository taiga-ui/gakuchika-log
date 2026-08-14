import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { ACTIVITY_CATEGORIES } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

const tabs = ["一覧", "カレンダー"];

export default function ActivitiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activities = useAppStore((state) => state.activities);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  const selectedActivities = [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <Screen>
      <View style={styles.headerBlock}>
        <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
          活動
        </ThemedText>
        <ThemedText
          type="default"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          記録を振り返りましょう
        </ThemedText>
      </View>

      <View style={[styles.segment, { backgroundColor: theme.surfaceMuted }]}>
        {tabs.map((tab, index) => (
          <Pressable
            key={tab}
            style={[
              styles.segmentButton,
              index === 0
                ? {
                    backgroundColor: theme.surface,
                    borderColor: Colors.light.border,
                  }
                : { backgroundColor: "transparent" },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{ color: index === 0 ? theme.text : theme.textSecondary }}
            >
              {tab}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.surfaceMuted }]}>
        <Ionicons name="search-outline" size={22} color={theme.textTertiary} />
        <ThemedText type="default" style={{ color: theme.textTertiary }}>
          {searchQuery || "活動を検索"}
        </ThemedText>
      </View>

      <View style={styles.filterRow}>
        {[
          { label: "すべて", value: "all" },
          ...ACTIVITY_CATEGORIES.map((category) => ({
            label: category.label,
            value: category.key,
          })),
        ].map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setSelectedCategory(item.value)}
            style={[
              styles.filterChip,
              item.value === selectedCategory
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: Colors.light.border,
                  },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{
                color:
                  item.value === selectedCategory
                    ? "#FFFFFF"
                    : theme.textSecondary,
              }}
            >
              {item.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {selectedActivities.map((activity, index) => {
          const isFeatured = index === 0;
          const isCompact = index > 0;

          if (isFeatured) {
            return (
              <Pressable
                key={activity.id}
                onPress={() => router.push(`/activities/${activity.id}`)}
                style={[styles.featureCard, { backgroundColor: theme.surface }]}
              >
                <View style={styles.featureImage} />
                <View style={styles.featureContent}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: theme.surfaceMuted },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      サークル
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="subtitle"
                    style={[styles.featureTitle, { color: theme.text }]}
                  >
                    {activity.title}
                  </ThemedText>
                </View>
                <ThemedText
                  type="default"
                  style={[styles.featureBody, { color: theme.textSecondary }]}
                >
                  {activity.body.length > 120
                    ? `${activity.body.slice(0, 120)}...`
                    : activity.body}
                </ThemedText>
                <View style={styles.metaRow}>
                  <View style={styles.dateRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={theme.textTertiary}
                    />
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      {activity.date.replace(/-/g, ".")}
                    </ThemedText>
                  </View>
                  <View style={styles.dateRow}>
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={theme.textTertiary}
                    />
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      2.5h
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={activity.id}
              onPress={() => router.push(`/activities/${activity.id}`)}
              style={[styles.compactCard, { backgroundColor: theme.surface }]}
            >
              <View style={styles.compactHeader}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.surfaceMuted },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {activity.categoryKey === "part-time"
                      ? "アルバイト"
                      : activity.categoryKey === "study"
                        ? "学業"
                        : "サークル"}
                  </ThemedText>
                </View>
                <Ionicons
                  name={
                    activity.categoryKey === "part-time"
                      ? "storefront-outline"
                      : activity.categoryKey === "study"
                        ? "school-outline"
                        : "people-outline"
                  }
                  size={24}
                  color={theme.textTertiary}
                />
              </View>

              <ThemedText
                type="subtitle"
                style={[styles.compactTitle, { color: theme.text }]}
              >
                {activity.title}
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.compactBody, { color: theme.textSecondary }]}
              >
                {activity.body.length > 110
                  ? `${activity.body.slice(0, 110)}...`
                  : activity.body}
              </ThemedText>
              <View style={styles.inlineMeta}>
                <View style={styles.dateRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={theme.textTertiary}
                  />
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {activity.date.replace(/-/g, ".")}
                  </ThemedText>
                </View>
                {activity.categoryKey === "study" ? (
                  <View style={styles.inlineAuthor}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={theme.textTertiary}
                    />
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary }}
                    >
                      学びあり
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.fab, { backgroundColor: "#0B7A57" }]}
        onPress={() => router.push("/activities/new")}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 42,
    lineHeight: 52,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 28,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.four,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: Spacing.three,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: Spacing.four,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  list: {
    gap: Spacing.three,
    paddingBottom: 88,
  },
  featureCard: {
    borderRadius: 22,
    padding: 0,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  featureImage: {
    height: 200,
    backgroundColor: "#d9e0df",
  },
  featureContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featureTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
  },
  featureBody: {
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 15,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compactCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compactTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
  },
  compactBody: {
    fontSize: 15,
    lineHeight: 24,
  },
  inlineMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 10,
  },
  inlineAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
