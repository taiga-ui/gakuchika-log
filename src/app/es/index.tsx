import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { type ActivityCategoryKey } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const projects = useAppStore((state) => state.projects);
  const categories = useAppStore((state) => state.categories);

  const getCountLabel = (key: ActivityCategoryKey) =>
    `${projects.filter((project) => project.category === key).length}個のプロジェクト`;

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.brandWrap}>
          <View style={[styles.avatar, { backgroundColor: "#D8D4CF" }]}>
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
          style={[styles.settingsButton, { backgroundColor: theme.surface }]}
          onPress={() => router.push("/settings" as never)}
        >
          <Ionicons name="settings-outline" size={28} color={theme.primary} />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Pressable
          style={[styles.searchBar, { backgroundColor: theme.surface }]}
          onPress={() => router.push("/es/search")}
        >
          <Ionicons
            name="search-outline"
            size={26}
            color={theme.textTertiary}
          />
          <ThemedText
            type="default"
            style={[styles.searchPlaceholder, { color: theme.textTertiary }]}
          >
            キーワード検索
          </ThemedText>
        </Pressable>

        <Pressable
          accessibilityLabel="AI検索"
          style={[styles.aiButton, { backgroundColor: theme.primarySoft }]}
          onPress={() => router.push("/es/ai")}
        >
          <Ionicons name="sparkles-outline" size={24} color={theme.primary} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            AI検索
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          カテゴリーから探す
        </ThemedText>

        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.key}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: category.softColor,
                  borderColor: category.borderColor,
                },
              ]}
              onPress={() => {
                setSelectedCategory(category.key);
                router.push("/activities");
              }}
            >
              <ThemedText
                type="default"
                style={[styles.categoryTitle, { color: category.color }]}
              >
                {category.label}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {getCountLabel(category.key)}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.five,
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  brandText: {
    fontSize: 18,
    lineHeight: 26,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  aiButton: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  section: {
    marginTop: Spacing.five,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: Spacing.three,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 18,
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
});
