import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type FloatingActionButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function FloatingActionButton({
  label,
  icon,
  onPress,
}: FloatingActionButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.primary }]}
    >
      <View style={styles.iconRow}>
        <Ionicons name={icon} size={18} color={theme.textInverse} />
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    bottom: 24,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
