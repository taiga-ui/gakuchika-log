import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from "@/constants/categories";
import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

const tabs = [
  { label: "一覧", value: "list" },
  { label: "カレンダー", value: "calendar" },
] as const;

export default function ActivitiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const projects = useAppStore((state) => state.projects);
  const activities = useAppStore((state) => state.activities);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["value"]>("list");

  const visibleProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects
      .filter(
        (project) =>
          selectedCategory === "all" || project.category === selectedCategory,
      )
      .filter(
        (project) =>
          !query ||
          project.name.toLowerCase().includes(query) ||
          activities.some(
            (activity) =>
              activity.projectId === project.id &&
              `${activity.title} ${activity.body}`
                .toLowerCase()
                .includes(query),
          ),
      )
      .sort((left, right) => left.name.localeCompare(right.name, "ja"));
  }, [activities, projects, searchQuery, selectedCategory]);

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <View style={styles.topBar}>
              <View style={styles.brandWrap}>
                <View style={styles.avatar}>
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
                style={[
                  styles.settingsButton,
                  { backgroundColor: theme.surface },
                ]}
                onPress={() => router.push("/settings" as never)}
              >
                <Ionicons
                  name="settings-outline"
                  size={28}
                  color={theme.primary}
                />
              </Pressable>
            </View>
            <ThemedText
              type="title"
              style={[styles.title, { color: theme.text }]}
            >
              活動
            </ThemedText>
            <View
              style={[styles.segment, { backgroundColor: theme.surfaceMuted }]}
            >
              {tabs.map((tab) => (
                <Pressable
                  key={tab.value}
                  onPress={() => setActiveTab(tab.value)}
                  style={[
                    styles.segmentButton,
                    {
                      backgroundColor:
                        activeTab === tab.value ? theme.surface : "transparent",
                      borderColor:
                        activeTab === tab.value
                          ? Colors.light.border
                          : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    style={{
                      color:
                        activeTab === tab.value
                          ? theme.text
                          : theme.textSecondary,
                    }}
                  >
                    {tab.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {activeTab === "list" ? (
              <>
                <View
                  style={[
                    styles.searchBox,
                    { backgroundColor: theme.surfaceMuted },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={22}
                    color={theme.textTertiary}
                  />
                  <ThemedText
                    style={{
                      color: searchQuery ? theme.text : theme.textTertiary,
                    }}
                  >
                    {searchQuery || "活動を検索"}
                  </ThemedText>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterRow}
                >
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
                        {
                          backgroundColor:
                            item.value === selectedCategory
                              ? theme.primary
                              : theme.surfaceMuted,
                          borderColor:
                            item.value === selectedCategory
                              ? theme.primary
                              : Colors.light.border,
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
                </ScrollView>
                <Pressable
                  style={[
                    styles.addProjectButton,
                    { borderColor: theme.primary },
                  ]}
                  onPress={() => router.push("/projects/new" as never)}
                >
                  <Ionicons name="add" size={20} color={theme.primary} />
                  <ThemedText type="smallBold" style={{ color: theme.primary }}>
                    プロジェクトを追加
                  </ThemedText>
                </Pressable>
                {visibleProjects.length ? (
                  <View style={styles.list}>
                    {visibleProjects.map((project) => {
                      const category = CATEGORY_MAP[project.category];
                      const count = activities.filter(
                        (activity) => activity.projectId === project.id,
                      ).length;
                      return (
                        <Pressable
                          key={project.id}
                          onPress={() =>
                            router.push(`/projects/${project.id}` as never)
                          }
                          style={[
                            styles.projectCard,
                            { backgroundColor: theme.surface },
                          ]}
                        >
                          <View style={styles.projectHeader}>
                            <View
                              style={[
                                styles.badge,
                                { backgroundColor: category.softColor },
                              ]}
                            >
                              <ThemedText
                                type="smallBold"
                                style={{ color: category.color }}
                              >
                                {category.label}
                              </ThemedText>
                            </View>
                            <Ionicons
                              name="chevron-forward"
                              size={22}
                              color={theme.textTertiary}
                            />
                          </View>
                          <ThemedText
                            type="subtitle"
                            style={{ color: theme.text }}
                          >
                            {project.name}
                          </ThemedText>
                          {project.description ? (
                            <ThemedText
                              numberOfLines={2}
                              style={{ color: theme.textSecondary }}
                            >
                              {project.description}
                            </ThemedText>
                          ) : null}
                          <ThemedText
                            type="small"
                            style={{ color: theme.textTertiary }}
                          >
                            活動記録 {count}件
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <EmptyState
                    icon="folder-open-outline"
                    title="プロジェクトがありません"
                    description="このカテゴリにプロジェクトを追加して、活動記録をまとめましょう。"
                    actionLabel="プロジェクトを追加"
                    onActionPress={() => router.push("/projects/new" as never)}
                  />
                )}
              </>
            ) : (
              <View
                style={[
                  styles.calendarCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <ThemedText type="smallBold" style={{ color: theme.text }}>
                  活動カレンダー
                </ThemedText>
                <ThemedText
                  style={{ color: theme.textSecondary, marginTop: 8 }}
                >
                  活動記録 {activities.length}件をカレンダーで確認できます。
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
        <Pressable
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => router.push("/activities/new")}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.eight,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.five,
  },
  brandWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8D4CF",
  },
  brandText: { fontSize: 18, lineHeight: 26 },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 42, lineHeight: 52, fontWeight: "700" },
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
    borderWidth: 1,
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
  filterRow: { gap: 8, paddingBottom: Spacing.three },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addProjectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 13,
    marginBottom: Spacing.four,
  },
  list: { gap: Spacing.three, paddingBottom: 150 },
  projectCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  calendarCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 26,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
