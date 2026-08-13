import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const keywordChips = ["リーダーシップ", "ボランティア", "問題解決"];

const categories = [
  {
    title: "サークル活動",
    count: "12件の記録",
    icon: "people-outline",
    iconBg: "#E1F0FF",
    iconColor: "#2E6CED",
  },
  {
    title: "アルバイト",
    count: "8件の記録",
    icon: "storefront-outline",
    iconBg: "#E9F8EC",
    iconColor: "#1DA365",
  },
  {
    title: "学業・研究",
    count: "5件の記録",
    icon: "book-outline",
    iconBg: "#F4E9D7",
    iconColor: "#B07D2E",
  },
  {
    title: "その他",
    count: "3件の記録",
    icon: "ellipsis-horizontal",
    iconBg: "#E5E7EB",
    iconColor: "#70757D",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();

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

      <ThemedText
        type="title"
        style={[styles.pageTitle, { color: theme.text }]}
      >
        探す
      </ThemedText>

      <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
        <Ionicons name="search-outline" size={26} color={theme.textTertiary} />
        <ThemedText type="default" style={{ color: theme.textTertiary }}>
          過去の経験を探す
        </ThemedText>

        <Pressable
          style={[styles.aiButton, { backgroundColor: theme.primarySoft }]}
        >
          <Ionicons name="sparkles-outline" size={24} color={theme.primary} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            AI
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          最近の検索キーワード
        </ThemedText>

        <View style={styles.keywordRow}>
          {keywordChips.map((label) => (
            <Pressable
              key={label}
              style={[styles.keywordChip, { backgroundColor: theme.surface }]}
            >
              <ThemedText type="default" style={{ color: theme.text }}>
                {label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
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
              key={category.title}
              style={[styles.categoryCard, { backgroundColor: theme.surface }]}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  { backgroundColor: category.iconBg },
                ]}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={category.iconColor}
                />
              </View>

              <ThemedText
                type="default"
                style={[styles.categoryTitle, { color: theme.text }]}
              >
                {category.title}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {category.count}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          ハイライト
        </ThemedText>

        <Pressable
          style={[styles.highlightCard, { backgroundColor: theme.surface }]}
        >
          <View
            style={[
              styles.highlightIconWrap,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons name="trophy-outline" size={32} color="#FFFFFF" />
          </View>

          <View style={styles.highlightTextBlock}>
            <ThemedText
              type="default"
              style={[styles.highlightTitle, { color: theme.text }]}
            >
              最も成長を感じた月
            </ThemedText>
            <ThemedText type="default" style={{ color: theme.textSecondary }}>
              先月は問題解決に関する活動が活発でした。
            </ThemedText>
          </View>
        </Pressable>
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
  pageTitle: {
    fontSize: 42,
    lineHeight: 52,
    fontWeight: "700",
    marginBottom: Spacing.three,
  },
  searchBar: {
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
  aiButton: {
    marginLeft: "auto",
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
  keywordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  keywordChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
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
    gap: 12,
  },
  categoryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 18,
  },
  highlightIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightTextBlock: {
    flex: 1,
    gap: 4,
  },
  highlightTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
});
