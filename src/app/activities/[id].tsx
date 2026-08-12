import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { PhotoHeader } from "@/components/ui/photo-header";
import { Screen } from "@/components/ui/screen";
import { CATEGORY_MAP } from "@/constants/categories";
import { TAG_MAP } from "@/constants/tags";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { formatJapaneseDate } from "@/utils/date";
import { GakuchikaCard } from "../../features/gakuchika/components/gakuchika-card";

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
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);

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

  const category = CATEGORY_MAP[activity.categoryKey];
  const relatedGakuchika = gakuchikaRecords.find((item) =>
    item.relatedActivityIds.includes(activity.id),
  );

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
      </View>

      <PhotoHeader
        photoAsset={activity.photoAsset}
        photoLabel={activity.photoLabel}
        categoryKey={activity.categoryKey}
        title={activity.title}
        subtitle={activity.body}
      />

      <SectionBlock title="活動概要">
        <ThemedText
          type="default"
          style={{ color: theme.textSecondary, lineHeight: 24 }}
        >
          {activity.body}
        </ThemedText>
        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryPill,
              {
                backgroundColor: category.softColor,
                borderColor: category.borderColor,
              },
            ]}
          >
            <ThemedText type="smallBold" style={{ color: category.color }}>
              {category.label}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textTertiary }}>
            {formatJapaneseDate(activity.date)}
          </ThemedText>
        </View>
      </SectionBlock>

      <SectionBlock title="タグ">
        <View style={styles.tagRow}>
          {activity.tagIds.map((tagId) => (
            <View
              key={tagId}
              style={[
                styles.tag,
                { backgroundColor: TAG_MAP[tagId].softColor },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: TAG_MAP[tagId].color }}
              >
                {TAG_MAP[tagId].label}
              </ThemedText>
            </View>
          ))}
        </View>
      </SectionBlock>

      <SectionBlock title="数字・成果">
        <View style={styles.metricColumn}>
          {activity.metrics?.length ? (
            activity.metrics.map((metric) => (
              <View
                key={metric}
                style={[
                  styles.metricCard,
                  { backgroundColor: theme.surfaceMuted },
                ]}
              >
                <ThemedText type="smallBold" style={{ color: theme.text }}>
                  {metric}
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              数字はあとから足せる。まずは記録を残すことを優先する。
            </ThemedText>
          )}
        </View>
      </SectionBlock>

      <SectionBlock title="写真・成果物">
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, lineHeight: 22 }}
        >
          {activity.photoAsset
            ? "写真付きで記録されているため、当時の状況を思い出しやすい。"
            : "写真がない場合でも、カテゴリ色とアイコンで記録を見分けられる。"}
        </ThemedText>
      </SectionBlock>

      {relatedGakuchika ? (
        <>
          <ThemedText
            type="smallBold"
            style={{
              color: theme.text,
              marginTop: Spacing.three,
              marginBottom: Spacing.two,
            }}
          >
            関連ガクチカ
          </ThemedText>
          <GakuchikaCard
            item={relatedGakuchika}
            onPress={() => router.push(`/gakuchika/${relatedGakuchika.id}`)}
          />
        </>
      ) : null}
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  metricColumn: {
    gap: 8,
  },
  metricCard: {
    borderRadius: 18,
    padding: Spacing.four,
  },
});
