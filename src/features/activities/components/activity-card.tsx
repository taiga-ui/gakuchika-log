import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PhotoHeader } from "@/components/ui/photo-header";
import { TagChip } from "@/components/ui/tag-chip";
import { CATEGORY_MAP } from "@/constants/categories";
import { TAG_MAP } from "@/constants/tags";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ActivityRecord } from "@/types/domain";
import { formatJapaneseDate } from "@/utils/date";

type ActivityCardProps = {
  activity: ActivityRecord;
  onPress?: () => void;
};

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const theme = useTheme();
  const category = CATEGORY_MAP[activity.categoryKey];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface },
        pressed && styles.pressed,
      ]}
    >
      <PhotoHeader
        photoAsset={activity.photoAsset}
        photoLabel={activity.photoLabel}
        categoryKey={activity.categoryKey}
        title={activity.title}
        subtitle={activity.body}
      />
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
      <ThemedText
        type="smallBold"
        style={[styles.title, { color: theme.text }]}
        numberOfLines={2}
      >
        {activity.title}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.body, { color: theme.textSecondary }]}
        numberOfLines={3}
      >
        {activity.body}
      </ThemedText>
      {activity.metrics?.length ? (
        <View style={styles.metricsRow}>
          {activity.metrics.slice(0, 2).map((metric) => (
            <View
              key={metric}
              style={[
                styles.metricPill,
                { backgroundColor: theme.surfaceMuted },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: theme.textSecondary }}
              >
                {metric}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.tagRow}>
        {activity.tagIds.slice(0, 3).map((tagId) => (
          <TagChip
            key={tagId}
            label={TAG_MAP[tagId].label}
            tone={TAG_MAP[tagId].softColor}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
    shadowColor: "#204080",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
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
  title: {
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
