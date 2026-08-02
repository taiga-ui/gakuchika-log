import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type TagChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: string;
};

export function TagChip({
  label,
  selected = false,
  onPress,
  tone,
}: TagChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected
            ? theme.primarySoft
            : (tone ?? theme.surfaceMuted),
          borderColor: selected ? theme.primary : Colors.light.border,
        },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{ color: selected ? theme.primary : theme.textSecondary }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
});
