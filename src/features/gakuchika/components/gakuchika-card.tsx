import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { GakuchikaRecord } from "@/types/domain";

type GakuchikaCardProps = {
  item: GakuchikaRecord;
  onPress?: () => void;
};

export function GakuchikaCard({ item, onPress }: GakuchikaCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <ThemedText
          type="smallBold"
          style={[styles.title, { color: theme.text }]}
          numberOfLines={2}
        >
          {item.title}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {item.period}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        type="small"
        style={[styles.overview, { color: theme.textSecondary }]}
        numberOfLines={3}
      >
        {item.overview}
      </ThemedText>
      <View style={styles.row}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          役割
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {item.role}
        </ThemedText>
      </View>
      <View style={styles.metricRow}>
        {item.numbers.map((value) => (
          <View
            key={value}
            style={[styles.metric, { backgroundColor: theme.surfaceMuted }]}
          >
            <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
              {value}
            </ThemedText>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  topRow: {
    gap: 10,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  overview: {
    fontSize: 13,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metric: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
