import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { PhotoHeader } from "@/components/ui/photo-header";
import { Screen } from "@/components/ui/screen";
import { CATEGORY_MAP } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { ActivityCard } from "@/features/activities/components/activity-card";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.detailRow}>
      <ThemedText type="smallBold" style={{ color: theme.text }}>
        {label}
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, flex: 1, textAlign: "right" }}
      >
        {value}
      </ThemedText>
    </View>
  );
}

export default function GakuchikaDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);
  const activities = useAppStore((state) => state.activities);

  const gakuchikaId = Array.isArray(params.id) ? params.id[0] : params.id;
  const item = gakuchikaRecords.find((record) => record.id === gakuchikaId);

  if (!item) {
    return (
      <Screen>
        <EmptyState
          icon="document-text-outline"
          title="ガクチカが見つかりません"
          description="一覧へ戻って別のカードを開いてください。"
          actionLabel="一覧へ戻る"
          onActionPress={() => router.back()}
        />
      </Screen>
    );
  }

  const relatedActivities = activities.filter((activity) =>
    item.relatedActivityIds.includes(activity.id),
  );
  const coverActivity = relatedActivities[0];
  const categoryKey = coverActivity?.categoryKey ?? "research";
  const category = CATEGORY_MAP[categoryKey];

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
            ガクチカ詳細
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            ESや面接に転用しやすい形で整理する
          </ThemedText>
        </View>
      </View>

      <PhotoHeader
        photoAsset={coverActivity?.photoAsset}
        photoLabel={coverActivity?.photoLabel}
        categoryKey={categoryKey}
        title={item.title}
        subtitle={item.overview}
      />

      <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          基本情報
        </ThemedText>
        <DetailRow label="活動概要" value={item.overview} />
        <DetailRow label="活動期間" value={item.period} />
        <DetailRow label="役割" value={item.role} />
        <DetailRow label="カテゴリ" value={category.label} />
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          STARの材料
        </ThemedText>
        <DetailRow label="課題" value={item.challenge} />
        <DetailRow label="困難" value={item.difficulty} />
        <DetailRow label="工夫" value={item.action} />
        <DetailRow label="結果" value={item.result} />
        <DetailRow label="学び" value={item.learning} />
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          数字・成果物
        </ThemedText>
        <View style={styles.metricRow}>
          {item.numbers.map((metric) => (
            <View
              key={metric}
              style={[
                styles.metricPill,
                { backgroundColor: theme.primarySoft },
              ]}
            >
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                {metric}
              </ThemedText>
            </View>
          ))}
        </View>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, lineHeight: 22 }}
        >
          {item.artifact}
        </ThemedText>
      </View>

      <View style={styles.relatedSection}>
        <ThemedText
          type="smallBold"
          style={{ color: theme.text, marginBottom: Spacing.two }}
        >
          関連する活動
        </ThemedText>
        <View style={styles.relatedList}>
          {relatedActivities.length ? (
            relatedActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => router.push(`/activities/${activity.id}`)}
              />
            ))
          ) : (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              関連する活動はまだありません。
            </ThemedText>
          )}
        </View>
      </View>
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
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  relatedSection: {
    marginTop: Spacing.four,
    marginBottom: Spacing.six,
  },
  relatedList: {
    gap: Spacing.four,
  },
});
