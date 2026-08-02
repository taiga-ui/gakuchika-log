import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Colors, Spacing } from "@/constants/theme";
import { ContributionGrid } from "@/features/calendar/components/contribution-grid";
import { useAppStore } from "@/store/use-app-store";
import {
  calculateStreak,
  countRecordsThisMonth,
  formatJapaneseDate,
} from "@/utils/date";

export default function CalendarScreen() {
  const activities = useAppStore((state) => state.activities);

  const sortedActivities = [...activities].sort((left, right) =>
    right.date.localeCompare(left.date),
  );
  const latest = sortedActivities.slice(0, 4);

  return (
    <Screen>
      <SectionHeader
        title="カレンダー"
        subtitle="活動の蓄積量を GitHub 風に見える化"
      />

      <View style={styles.statRow}>
        <StatCard
          label="今月の記録数"
          value={`${countRecordsThisMonth(activities)}`}
          helper="月次の積み上げ"
        />
        <StatCard
          label="連続記録"
          value={`${calculateStreak(activities)}`}
          helper="日連続"
          tone="success"
        />
      </View>

      <ContributionGrid activities={activities} />

      <View style={[styles.panel, { backgroundColor: Colors.light.surface }]}>
        <ThemedText type="smallBold" style={{ color: Colors.light.text }}>
          最近の記録
        </ThemedText>
        <View style={styles.latestList}>
          {latest.map((item) => (
            <View
              key={item.id}
              style={[
                styles.latestRow,
                { borderBottomColor: Colors.light.border },
              ]}
            >
              <View>
                <ThemedText
                  type="smallBold"
                  style={{ color: Colors.light.text }}
                >
                  {item.title}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: Colors.light.textSecondary }}
                >
                  {item.body}
                </ThemedText>
              </View>
              <ThemedText
                type="small"
                style={{ color: Colors.light.textTertiary }}
              >
                {formatJapaneseDate(item.date)}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  panel: {
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 14,
    marginTop: Spacing.four,
    marginBottom: Spacing.six,
  },
  latestList: {
    gap: 12,
  },
  latestRow: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
});
