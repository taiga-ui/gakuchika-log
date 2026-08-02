import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ActivityRecord } from "@/types/domain";
import { buildContributionGrid } from "@/utils/date";

type ContributionGridProps = {
  activities: ActivityRecord[];
};

export function ContributionGrid({ activities }: ContributionGridProps) {
  const theme = useTheme();
  const cells = buildContributionGrid(activities);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          Activity Log
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          GitHub Contribution 風
        </ThemedText>
      </View>
      <View style={styles.grid}>
        {cells.map((cell) => (
          <View
            key={cell.date}
            style={[
              styles.cell,
              {
                backgroundColor:
                  cell.count >= 3
                    ? theme.primary
                    : cell.count === 2
                      ? theme.success
                      : cell.count === 1
                        ? theme.accent
                        : theme.surfaceMuted,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        <ThemedText type="small" style={{ color: theme.textTertiary }}>
          少ない
        </ThemedText>
        <View
          style={[styles.legendCell, { backgroundColor: theme.surfaceMuted }]}
        />
        <View style={[styles.legendCell, { backgroundColor: theme.accent }]} />
        <View style={[styles.legendCell, { backgroundColor: theme.success }]} />
        <View style={[styles.legendCell, { backgroundColor: theme.primary }]} />
        <ThemedText type="small" style={{ color: theme.textTertiary }}>
          多い
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cell: {
    width: 18,
    height: 18,
    borderRadius: 6,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  legendCell: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
});
