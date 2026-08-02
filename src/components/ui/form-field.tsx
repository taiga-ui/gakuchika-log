import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  helperText?: string;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  helperText,
}: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={{ color: theme.text }}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.inputShell,
          { backgroundColor: theme.surface, borderColor: Colors.light.border },
        ]}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            { color: theme.text },
            multiline && styles.multiline,
          ]}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
      {helperText ? (
        <ThemedText type="small" style={{ color: theme.textTertiary }}>
          {helperText}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputShell: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
  },
  input: {
    minHeight: 52,
    fontSize: 15,
    paddingVertical: 14,
  },
  multiline: {
    minHeight: 132,
  },
});
