import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import {
  CATEGORY_MAP,
  UNCATEGORIZED_CATEGORY,
  UNCATEGORIZED_CATEGORY_KEY,
} from "@/constants/categories";
import { LOCAL_OWNER_ID } from "@/constants/owner";
import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function ActivitiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const projects = useAppStore((state) => state.projects);
  const categories = useAppStore((state) => state.categories);
  const activities = useAppStore((state) => state.activities);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const addCategory = useAppStore((state) => state.addCategory);
  const updateCategory = useAppStore((state) => state.updateCategory);
  const deleteCategory = useAppStore((state) => state.deleteCategory);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(
    null,
  );

  const visibleProjects = useMemo(() => {
    return projects
      .filter((project) => project.ownerId === LOCAL_OWNER_ID)
      .filter(
        (project) =>
          selectedCategory === "all" || project.category === selectedCategory,
      )
      .sort((left, right) => left.name.localeCompare(right.name, "ja"));
  }, [projects, selectedCategory]);

  const handleAddCategory = () => {
    const label = newCategoryName.trim();
    if (!label) return;
    if (editingCategoryKey) {
      updateCategory(editingCategoryKey, label);
      setNewCategoryName("");
      setEditingCategoryKey(null);
      setIsCategoryModalVisible(false);
      return;
    }
    const addedCategory = addCategory(label);
    setSelectedCategory(addedCategory.key);
    setNewCategoryName("");
    setIsCategoryModalVisible(false);
  };

  const openCategoryActions = (key: string, label: string) => {
    Alert.alert(label, undefined, [
      {
        text: "編集",
        onPress: () => {
          setEditingCategoryKey(key);
          setNewCategoryName(label);
          setIsCategoryModalVisible(true);
        },
      },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            `${label}を削除しますか？`,
            "プロジェクトと活動記録は削除されません。",
            [
              { text: "キャンセル", style: "cancel" },
              {
                text: "削除",
                style: "destructive",
                onPress: () => {
                  deleteCategory(key);
                  if (selectedCategory === key) setSelectedCategory("all");
                },
              },
            ],
          );
        },
      },
      { text: "キャンセル", style: "cancel" },
    ]);
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.headerInner}>
          <View style={styles.topBar}>
            <View style={styles.brandWrap}>
              <View style={styles.avatar}>
                <ThemedText type="smallBold" style={{ color: "#4E4B46" }}>
                  田
                </ThemedText>
              </View>
              <ThemedText
                type="smallBold"
                style={[styles.brandText, { color: theme.primary }]}
              >
                ガクチカログ
              </ThemedText>
            </View>
            <Pressable
              style={[
                styles.settingsButton,
                { backgroundColor: theme.surface },
              ]}
              onPress={() => router.push("/settings" as never)}
            >
              <Ionicons
                name="settings-outline"
                size={28}
                color={theme.primary}
              />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            bounces={false}
            removeClippedSubviews={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={[
              styles.filterRow,
              { backgroundColor: theme.background },
            ]}
          >
            {[
              { label: "すべて", value: "all" },
              ...categories.map((category) => ({
                label: category.label,
                value: category.key,
              })),
            ].map((item) => (
              <Pressable
                key={item.value}
                android_ripple={{ color: "transparent" }}
                onPress={() => setSelectedCategory(item.value)}
                onLongPress={
                  item.value === "all" ||
                  item.value === UNCATEGORIZED_CATEGORY_KEY
                    ? undefined
                    : () => openCategoryActions(item.value, item.label)
                }
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      item.value === selectedCategory
                        ? theme.primary
                        : theme.surfaceMuted,
                    borderColor:
                      item.value === selectedCategory
                        ? theme.primary
                        : Colors.light.border,
                  },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{
                    color:
                      item.value === selectedCategory
                        ? "#FFFFFF"
                        : theme.textSecondary,
                  }}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            ))}
            <Pressable
              accessibilityLabel="カテゴリを追加"
              onPress={() => setIsCategoryModalVisible(true)}
              style={[
                styles.addCategoryChip,
                {
                  backgroundColor: theme.surfaceMuted,
                  borderColor: Colors.light.border,
                },
              ]}
            >
              <Ionicons name="add" size={20} color={theme.textSecondary} />
            </Pressable>
          </ScrollView>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <Pressable
              style={[styles.addProjectButton, { borderColor: theme.primary }]}
              onPress={() => router.push("/projects/new" as never)}
            >
              <Ionicons name="add" size={20} color={theme.primary} />
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                プロジェクトを追加
              </ThemedText>
            </Pressable>
            {visibleProjects.length ? (
              <View style={styles.list}>
                {visibleProjects.map((project) => {
                  const category =
                    categories.find((item) => item.key === project.category) ??
                    CATEGORY_MAP[project.category] ??
                    UNCATEGORIZED_CATEGORY;
                  const count = activities.filter(
                    (activity) =>
                      activity.projectId === project.id &&
                      activity.ownerId === LOCAL_OWNER_ID,
                  ).length;
                  return (
                    <Pressable
                      key={project.id}
                      onPress={() =>
                        router.push(`/projects/${project.id}` as never)
                      }
                      style={[
                        styles.projectCard,
                        { backgroundColor: theme.surface },
                      ]}
                    >
                      <View style={styles.projectHeader}>
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: category.softColor },
                          ]}
                        >
                          <ThemedText
                            type="smallBold"
                            style={{ color: category.color }}
                          >
                            {category.label}
                          </ThemedText>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={22}
                          color={theme.textTertiary}
                        />
                      </View>
                      <ThemedText type="subtitle" style={{ color: theme.text }}>
                        {project.name}
                      </ThemedText>
                      {project.description ? (
                        <ThemedText
                          numberOfLines={2}
                          style={{ color: theme.textSecondary }}
                        >
                          {project.description}
                        </ThemedText>
                      ) : null}
                      <ThemedText
                        type="small"
                        style={{ color: theme.textTertiary }}
                      >
                        活動記録 {count}件
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <EmptyState
                icon="folder-open-outline"
                title="プロジェクトがありません"
                description="このカテゴリにプロジェクトを追加して、活動記録をまとめましょう。"
              />
            )}
          </View>
        </ScrollView>
        <Modal
          visible={isCategoryModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsCategoryModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[styles.modalCard, { backgroundColor: theme.surface }]}
            >
              <ThemedText type="subtitle" style={{ color: theme.text }}>
                {editingCategoryKey ? "カテゴリを編集" : "カテゴリを追加"}
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
                    setEditingCategoryKey(null);
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
                    {editingCategoryKey ? "保存" : "追加"}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => router.push("/activities/new")}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  headerInner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.five,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.eight,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.five,
  },
  brandWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8D4CF",
  },
  brandText: { fontSize: 18, lineHeight: 26 },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: { gap: 8, paddingBottom: Spacing.three },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addCategoryChip: {
    width: 44,
    height: 42,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  addProjectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 13,
    marginBottom: Spacing.four,
  },
  list: { gap: Spacing.three, paddingBottom: 150 },
  projectCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 26,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
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
