import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import type { ActivityCategoryKey } from "@/constants/categories";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function NewProjectScreen() {
  const router = useRouter();
  const theme = useTheme();
  const addProject = useAppStore((state) => state.addProject);
  const categories = useAppStore((state) => state.categories);
  const addCategory = useAppStore((state) => state.addCategory);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ActivityCategoryKey>("research");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    addProject(trimmedName, category);
    router.back();
  };

  const handleAddCategory = () => {
    const label = newCategoryName.trim();
    if (!label) return;
    const addedCategory = addCategory(label);
    setCategory(addedCategory.key);
    setNewCategoryName("");
    setIsCategoryModalVisible(false);
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
        <View style={styles.headingRow}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            カテゴリ
          </ThemedText>
          <Pressable
            accessibilityLabel="カテゴリを追加"
            hitSlop={8}
            onPress={() => setIsCategoryModalVisible(true)}
            style={[
              styles.smallAddButton,
              { backgroundColor: theme.primarySoft },
            ]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </Pressable>
        </View>
        <View style={styles.filterRow}>
          {categories.map((item) => (
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

      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <ThemedText type="subtitle" style={{ color: theme.text }}>
              カテゴリを追加
            </ThemedText>
            <FormField
              label="カテゴリ名"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="例: 学外活動"
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setNewCategoryName("");
                  setIsCategoryModalVisible(false);
                }}
                style={styles.modalAction}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: theme.textSecondary }}
                >
                  キャンセル
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim()}
                style={[
                  styles.modalAction,
                  styles.modalPrimaryAction,
                  {
                    backgroundColor: theme.primary,
                    opacity: newCategoryName.trim() ? 1 : 0.5,
                  },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: theme.textInverse }}
                >
                  追加
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  smallAddButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.five,
    backgroundColor: "rgba(22, 32, 51, 0.35)",
  },
  modalCard: {
    borderRadius: 22,
    padding: Spacing.five,
    gap: Spacing.four,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalAction: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalPrimaryAction: {
    minWidth: 72,
    alignItems: "center",
  },
});
