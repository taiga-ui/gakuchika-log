import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.iconShell, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={30} color={theme.primary} />
      </View>
      <ThemedText
        type="smallBold"
        style={[styles.title, { color: theme.text }]}
      >
        {title}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.description, { color: theme.textSecondary }]}
      >
        {description}
      </ThemedText>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: Spacing.five,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iconShell: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
  },
  description: {
    textAlign: "center",
    lineHeight: 21,
  },
  button: {
    marginTop: 4,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});
