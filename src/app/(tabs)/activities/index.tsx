import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Screen } from "@/components/ui/screen";
import { SearchField } from "@/components/ui/search-field";
import { SectionHeader } from "@/components/ui/section-header";
import { TagChip } from "@/components/ui/tag-chip";
import { ACTIVITY_CATEGORIES, ALL_CATEGORY_KEY } from "@/constants/categories";
import { TAG_MAP } from "@/constants/tags";
import { Colors, Spacing } from "@/constants/theme";
import { ActivityCard } from "@/features/activities/components/activity-card";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function ActivitiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activities = useAppStore((state) => state.activities);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  const filteredActivities = activities.filter((activity) => {
    const category =
      activity.categoryKey === selectedCategory ||
      selectedCategory === ALL_CATEGORY_KEY;
    const haystack = [
      activity.title,
      activity.body,
      ...activity.tagIds.map((tagId) => TAG_MAP[tagId].label),
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" || haystack.includes(searchQuery.toLowerCase());

    return category && matchesSearch;
  });

  return (
    <Screen>
      <SectionHeader
        title="活動一覧"
        subtitle="写真あり・写真なしの両方に対応した記録一覧"
        actionLabel="新規記録"
        onActionPress={() => router.push("/activities/new")}
      />

      <SearchField
        value={searchQuery}
        placeholder="タイトル、タグ、内容を検索"
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <View style={styles.filterRow}>
        <TagChip
          label="すべて"
          selected={selectedCategory === ALL_CATEGORY_KEY}
          onPress={() => setSelectedCategory(ALL_CATEGORY_KEY)}
          tone={theme.surfaceMuted}
        />
        {ACTIVITY_CATEGORIES.map((category) => (
          <TagChip
            key={category.key}
            label={category.label}
            selected={selectedCategory === category.key}
            onPress={() => setSelectedCategory(category.key)}
            tone={category.softColor}
          />
        ))}
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            表示中
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.text }}>
            {filteredActivities.length}
          </ThemedText>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            カテゴリ
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.text }}>
            {selectedCategory === ALL_CATEGORY_KEY
              ? "すべて"
              : (ACTIVITY_CATEGORIES.find(
                  (item) => item.key === selectedCategory,
                )?.label ?? "未選択")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.list}>
        {filteredActivities.length ? (
          filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => router.push(`/activities/${activity.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="folder-open-outline"
            title="まだ活動がありません"
            description="今日の活動を1件入れるだけで、一覧・カレンダー・ガクチカ候補に反映できます。"
            actionLabel="新規記録"
            onActionPress={() => router.push("/activities/new")}
          />
        )}
      </View>

      <FloatingActionButton
        label="記録"
        icon="add"
        onPress={() => router.push("/activities/new")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: Spacing.four,
    marginBottom: Spacing.four,
  },
  summaryRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 22,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 4,
  },
  list: {
    gap: Spacing.four,
    paddingBottom: 80,
  },
});
