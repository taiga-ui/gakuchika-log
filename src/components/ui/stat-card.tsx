import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: "primary" | "success" | "accent" | "neutral";
};

const toneMap = {
  primary: Colors.light.primarySoft,
  success: "#E3F6EC",
  accent: "#FFF4DD",
  neutral: Colors.light.surfaceMuted,
} as const;

export function StatCard({
  label,
  value,
  helper,
  tone = "primary",
}: StatCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={[styles.badge, { backgroundColor: toneMap[tone] }]} />
      <ThemedText
        type="small"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
      <ThemedText type="subtitle" style={[styles.value, { color: theme.text }]}>
        {value}
      </ThemedText>
      {helper ? (
        <ThemedText
          type="small"
          style={[styles.helper, { color: theme.textTertiary }]}
        >
          {helper}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    padding: Spacing.four,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 110,
  },
  badge: {
    width: 34,
    height: 6,
    borderRadius: 999,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 26,
    lineHeight: 30,
  },
  helper: {
    fontSize: 12,
  },
});
