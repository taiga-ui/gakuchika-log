import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SearchFieldProps = {
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
};

export function SearchField({
  value,
  placeholder = "検索",
  onChangeText,
  onClear,
}: SearchFieldProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: Colors.light.border },
      ]}
    >
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        onChangeText={onChangeText}
        style={[styles.input, { color: theme.text }]}
      />
      {value && onClear ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <View
            style={[
              styles.clearButton,
              { backgroundColor: theme.surfaceMuted },
            ]}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
