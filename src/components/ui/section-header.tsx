import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <ThemedText
          type="smallBold"
          style={[styles.title, { color: theme.text }]}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            type="small"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={[styles.action, { backgroundColor: theme.primarySoft }]}
        >
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
  action: {
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
  },
});
