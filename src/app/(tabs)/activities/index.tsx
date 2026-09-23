import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from "@/constants/categories";
import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function ActivitiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const projects = useAppStore((state) => state.projects);
  const categories = useAppStore((state) => state.categories);
  const activities = useAppStore((state) => state.activities);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  const visibleProjects = useMemo(() => {
    return projects
      .filter(
        (project) =>
          selectedCategory === "all" || project.category === selectedCategory,
      )
      .sort((left, right) => left.name.localeCompare(right.name, "ja"));
  }, [projects, selectedCategory]);

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
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {[
                  { label: "すべて", value: "all" },
                  ...categories.map((category) => ({
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
                    const category =
                      categories.find(
                        (item) => item.key === project.category,
                      ) ??
                      CATEGORY_MAP[project.category] ??
                      ACTIVITY_CATEGORIES[0];
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
