import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
      <ThemedText
        type="smallBold"
        style={[styles.sectionTitle, { color: theme.text }]}
      >
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

export default function ActivityDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const activities = useAppStore((state) => state.activities);
  const tags = useAppStore((state) => state.tags);
  const projects = useAppStore((state) => state.projects);
  const deleteActivity = useAppStore((state) => state.deleteActivity);

  const activityId = Array.isArray(params.id) ? params.id[0] : params.id;
  const activity = activities.find((item) => item.id === activityId);

  if (!activity) {
    return (
      <Screen>
        <EmptyState
          icon="alert-circle-outline"
          title="活動が見つかりません"
          description="一覧から戻るか、新規記録を作成してください。"
          actionLabel="一覧へ戻る"
          onActionPress={() => router.back()}
        />
      </Screen>
    );
  }

  const project = projects.find((item) => item.id === activity.projectId);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            活動詳細
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            ガクチカにつながる記録を1件ずつ残す
          </ThemedText>
        </View>
        <Pressable
          onPress={() => {
            deleteActivity(activityId ?? "");
            router.back();
          }}
        >
          <Ionicons name="trash-outline" size={22} color={theme.textTertiary} />
        </Pressable>
      </View>

      <SectionBlock title="タイトル">
        <ThemedText style={{ color: theme.text }}>{activity.title}</ThemedText>
      </SectionBlock>

      <SectionBlock title="内容">
        <ThemedText
          type="default"
          style={{ color: theme.textSecondary, lineHeight: 24 }}
        >
          {activity.body}
        </ThemedText>
      </SectionBlock>

      <SectionBlock title="日付">
        <ThemedText style={{ color: theme.text }}>{activity.date}</ThemedText>
      </SectionBlock>

      <SectionBlock title="場所">
        <ThemedText style={{ color: theme.text }}>
          {activity.location || "未入力"}
        </ThemedText>
      </SectionBlock>

      <SectionBlock title="プロジェクト">
        <ThemedText style={{ color: theme.text }}>
          {project?.name || "未入力"}
        </ThemedText>
      </SectionBlock>

      <SectionBlock title="タグ">
        <View style={styles.tagRow}>
          {activity.tagIds.map((tagId) =>
            (() => {
              const tag = tags.find((item) => item.id === tagId);
              if (!tag) return null;
              return (
                <View
                  key={tagId}
                  style={[styles.tag, { backgroundColor: tag.softColor }]}
                >
                  <ThemedText type="smallBold" style={{ color: tag.color }}>
                    {tag.label}
                  </ThemedText>
                </View>
              );
            })(),
          )}
        </View>
      </SectionBlock>

      <Pressable
        style={[styles.editButton, { backgroundColor: theme.primary }]}
        onPress={() =>
          router.push({
            pathname: "/activities/new",
            params: { activityId: activity.id },
          } as never)
        }
      >
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          編集
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: Spacing.four,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionCard: {
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
    marginTop: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButton: {
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: Spacing.five,
    marginBottom: Spacing.six,
  },
});
