import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function ProjectDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const project = useAppStore((state) =>
    state.projects.find((item) => item.id === id),
  );
  const allActivities = useAppStore((state) => state.activities);
  const categories = useAppStore((state) => state.categories);
  const activities = useMemo(
    () =>
      allActivities
        .filter((item) => item.projectId === id)
        .sort((left, right) => right.date.localeCompare(left.date)),
    [allActivities, id],
  );
  const deleteProject = useAppStore((state) => state.deleteProject);
  if (!project)
    return (
      <Screen>
        <EmptyState
          icon="folder-open-outline"
          title="プロジェクトが見つかりません"
          description="一覧から別のプロジェクトを開いてください。"
          actionLabel="一覧へ戻る"
          onActionPress={() => router.back()}
        />
      </Screen>
    );
  const handleDelete = () => {
    Alert.alert(
      "プロジェクトを削除しますか？",
      `このプロジェクトに含まれる活動記録${activities.length ? `（${activities.length}件）` : ""}も削除されます。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () => {
            deleteProject(project.id);
            router.replace("/(tabs)/activities" as never);
          },
        },
      ],
    );
  };
  const category =
    categories.find((item) => item.key === project.category) ??
    CATEGORY_MAP[project.category] ??
    ACTIVITY_CATEGORIES[0];
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            プロジェクト
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {category.label}
          </ThemedText>
        </View>
        <Pressable
          accessibilityLabel="プロジェクトを編集"
          onPress={() =>
            router.push({
              pathname: "/projects/new",
              params: { projectId: project.id },
            })
          }
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={theme.textTertiary}
          />
        </Pressable>
        <Pressable
          accessibilityLabel="プロジェクトを削除"
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={22} color={theme.textTertiary} />
        </Pressable>
      </View>
      <ThemedText type="title" style={{ color: theme.text }}>
        {project.name}
      </ThemedText>
      {project.description ? (
        <ThemedText style={{ color: theme.textSecondary, marginTop: 8 }}>
          {project.description}
        </ThemedText>
      ) : null}
      {project.startDate || project.endDate ? (
        <ThemedText style={{ color: theme.textTertiary, marginTop: 8 }}>
          {project.startDate ?? "開始日未設定"} -{" "}
          {project.endDate ?? "終了日未設定"}
        </ThemedText>
      ) : null}
      <Pressable
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() =>
          router.push({
            pathname: "/activities/new",
            params: { projectId: project.id },
          })
        }
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <ThemedText type="smallBold" style={{ color: "#FFFFFF" }}>
          活動を記録
        </ThemedText>
      </Pressable>
      <ThemedText
        type="smallBold"
        style={[styles.heading, { color: theme.text }]}
      >
        活動記録（{activities.length}件）
      </ThemedText>
      {activities.length ? (
        activities.map((activity) => (
          <Pressable
            key={activity.id}
            style={[styles.activity, { backgroundColor: theme.surface }]}
            onPress={() => router.push(`/activities/${activity.id}`)}
          >
            <View style={{ flex: 1 }}>
              <ThemedText type="small" style={{ color: theme.textTertiary }}>
                {activity.date.replace(/-/g, "/")}
              </ThemedText>
              <ThemedText type="subtitle" style={{ color: theme.text }}>
                {activity.title}
              </ThemedText>
              <ThemedText
                numberOfLines={2}
                style={{ color: theme.textSecondary }}
              >
                {activity.body}
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textTertiary}
            />
          </Pressable>
        ))
      ) : (
        <EmptyState
          icon="document-text-outline"
          title="まだ活動記録がありません"
          description="このプロジェクトの活動を記録しましょう。"
          actionLabel="活動を記録"
          onActionPress={() =>
            router.push({
              pathname: "/activities/new",
              params: { projectId: project.id },
            })
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: Spacing.four,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 18,
    paddingVertical: 14,
    marginTop: Spacing.four,
  },
  heading: { marginTop: Spacing.five, marginBottom: Spacing.three },
  activity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
  },
});
