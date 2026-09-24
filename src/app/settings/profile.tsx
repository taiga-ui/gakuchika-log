import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { PROFILE_FIELD_LABELS, type ProfileField } from "@/constants/profile";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

const profileFields: ProfileField[] = [
  "name",
  "school",
  "faculty",
  "grade",
  "target",
];

export default function ProfileEditScreen() {
  const router = useRouter();
  const theme = useTheme();
  const profile = useAppStore((state) => state.profile);

  const getValue = (field: ProfileField) => {
    const value = profile[field];
    return Array.isArray(value) ? value.join("、") : value;
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
        </Pressable>
        <ThemedText type="subtitle" style={{ color: theme.text }}>
          プロフィール
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ThemedText
        type="small"
        style={[styles.description, { color: theme.textSecondary }]}
      >
        各項目をタップしてプロフィールを編集できます。
      </ThemedText>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        {profileFields.map((field, index) => {
          const value = getValue(field);
          return (
            <Pressable
              key={field}
              onPress={() => router.push(`/settings/profile/${field}` as never)}
              style={[
                styles.row,
                index < profileFields.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowCopy}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {PROFILE_FIELD_LABELS[field]}
                </ThemedText>
                <ThemedText
                  type="default"
                  style={{ color: value ? theme.text : theme.textTertiary }}
                  numberOfLines={1}
                >
                  {value || "未設定"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.textTertiary}
              />
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 58,
    marginHorizontal: -Spacing.five,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 38, alignItems: "flex-start" },
  headerSpacer: { width: 38 },
  description: { marginBottom: Spacing.three },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  row: {
    minHeight: 82,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  rowCopy: { flex: 1, gap: 4 },
});
