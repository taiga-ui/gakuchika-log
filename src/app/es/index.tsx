import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import {
  ACTIVITY_CATEGORIES,
  type ActivityCategoryKey,
} from "@/constants/categories";
import { CATEGORY_COUNT_MAP } from "@/constants/mock-data";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  const getCountLabel = (key: ActivityCategoryKey) =>
    `${CATEGORY_COUNT_MAP[key] ?? 0}件の記録`;

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

        <Pressable
          style={styles.searchInputButton}
          onPress={() => {
            setIsFocused(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="キーワード検索"
            placeholderTextColor={theme.textTertiary}
            style={[styles.searchInput, { color: theme.text }]}
            editable
          />
        </Pressable>

        {isFocused ? (
          <Pressable
            style={[
              styles.searchSubmitButton,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons name="arrow-up" size={24} color={theme.textInverse} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.aiButton, { backgroundColor: theme.primarySoft }]}
            onPress={() => router.push("/es/ai")}
          >
            <Ionicons name="sparkles-outline" size={24} color={theme.primary} />
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              AI
            </ThemedText>
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          カテゴリーから探す
        </ThemedText>

        <View style={styles.categoryGrid}>
          {ACTIVITY_CATEGORIES.map((category) => (
            <Pressable
              key={category.key}
              style={[styles.categoryCard, { backgroundColor: theme.surface }]}
              onPress={() => {
                setSelectedCategory(category.key);
                router.push("/activities");
              }}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  { backgroundColor: category.softColor },
                ]}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={28}
                  color={category.color}
                />
              </View>

              <ThemedText
                type="default"
                style={[styles.categoryTitle, { color: theme.text }]}
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
  searchInputButton: {
    flex: 1,
    minHeight: 34,
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 0,
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
  searchSubmitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
});
