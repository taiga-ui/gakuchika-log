import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import { ACTIVITY_CATEGORIES } from "@/constants/categories";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function NewProjectScreen() {
  const router = useRouter();
  const theme = useTheme();
  const addProject = useAppStore((state) => state.addProject);
  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<(typeof ACTIVITY_CATEGORIES)[number]["key"]>("research");

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    addProject(trimmedName, category);
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ marginTop: 10 }}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <ThemedText
          type="smallBold"
          style={{ color: theme.primary, marginTop: 10 }}
        >
          プロジェクトを追加
        </ThemedText>
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
          {ACTIVITY_CATEGORIES.map((item) => (
            <TagChip
              key={item.key}
              label={item.label}
              selected={category === item.key}
              onPress={() => setCategory(item.key)}
              tone={item.softColor}
            />
          ))}
        </View>
      </View>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: theme.primary, opacity: name.trim() ? 1 : 0.5 },
        ]}
        onPress={handleSave}
        disabled={!name.trim()}
      >
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          保存
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: Spacing.four,
  },
  section: {
    gap: 12,
    marginTop: Spacing.four,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: Spacing.five,
  },
});
