import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import { ACTIVITY_CATEGORIES } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function NewProjectScreen() {
  const router = useRouter();
  const theme = useTheme();
  const addProject = useAppStore((state) => state.addProject);
  const [name, setName] = useState("");
  const [categoryKey, setCategoryKey] =
    useState<(typeof ACTIVITY_CATEGORIES)[number]["key"]>("research");

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    addProject(trimmedName, categoryKey);
    router.back();
  };

  return (
    <Screen>
      <View style={[styles.headerRow, { marginTop: Spacing.two }]}>
        <Pressable
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={20} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            プロジェクトを追加
          </ThemedText>
        </View>
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: theme.primary, opacity: name.trim() ? 1 : 0.5 },
          ]}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
            保存
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <FormField
          label="プロジェクト名"
          value={name}
          onChangeText={setName}
          placeholder="例: 学園祭企画"
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          カテゴリ
        </ThemedText>
        <View style={styles.filterRow}>
          {ACTIVITY_CATEGORIES.map((category) => (
            <TagChip
              key={category.key}
              label={category.label}
              selected={categoryKey === category.key}
              onPress={() => setCategoryKey(category.key)}
              tone={category.softColor}
            />
          ))}
        </View>
      </View>

      <Pressable
        style={[
          styles.fullButton,
          { backgroundColor: theme.primary, opacity: name.trim() ? 1 : 0.5 },
        ]}
        onPress={handleSave}
        disabled={!name.trim()}
      >
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          このプロジェクトを保存する
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: Spacing.four,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  saveButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  section: {
    marginTop: Spacing.four,
    gap: 12,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fullButton: {
    marginTop: Spacing.five,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: Spacing.six,
  },
});
