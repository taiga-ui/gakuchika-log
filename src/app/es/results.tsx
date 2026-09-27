import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import type { SearchResultKind } from "@/utils/search";

export default function SearchResultsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const query = useAppStore((state) => state.searchQuery);
  const results = useAppStore((state) => state.searchResults);
  const activities = useAppStore((state) => state.activities);
  const projects = useAppStore((state) => state.projects);
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);
  const tags = useAppStore((state) => state.tags);
  const refreshSearchResults = useAppStore(
    (state) => state.refreshSearchResults,
  );

  useEffect(() => {
    refreshSearchResults();
  }, [activities, projects, gakuchikaRecords, tags, refreshSearchResults]);

  const getResultIcon = (kind: SearchResultKind) => {
    switch (kind) {
      case "activity":
        return "journal-outline" as const;
      case "project":
        return "folder-open-outline" as const;
      case "gakuchika":
        return "sparkles-outline" as const;
      case "es":
        return "document-text-outline" as const;
    }
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="戻る"
            style={[styles.backButton, { backgroundColor: theme.surface }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color={theme.primary} />
          </Pressable>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            検索結果
          </ThemedText>
          <View style={styles.topBarSpacer} />
        </View>

        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          「{query.trim()}」の検索結果
        </ThemedText>

        <ScrollView
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          {results.length === 0 ? (
            <View style={styles.emptyContent}>
              <Ionicons
                name={query.trim() ? "file-tray-outline" : "search-outline"}
                size={42}
                color={theme.textTertiary}
              />
              <ThemedText type="subtitle" style={{ color: theme.text }}>
                {query.trim()
                  ? `「${query.trim()}」に一致する結果がありません`
                  : "キーワードを入力してください"}
              </ThemedText>
              <ThemedText style={{ color: theme.textSecondary }}>
                {query.trim()
                  ? "別のキーワードで検索してみてください"
                  : "検索画面へ戻ってキーワードを入力してください"}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.resultsSection}>
              <ThemedText type="smallBold" style={{ color: theme.text }}>
                検索結果 {results.length}件
              </ThemedText>
              {results.map((result) => (
                <Pressable
                  key={`${result.kind}-${result.id}`}
                  style={[
                    styles.resultCard,
                    { backgroundColor: theme.surface },
                  ]}
                  onPress={() => router.push(result.route as never)}
                >
                  <View
                    style={[
                      styles.resultIcon,
                      { backgroundColor: theme.primarySoft },
                    ]}
                  >
                    <Ionicons
                      name={getResultIcon(result.kind)}
                      size={22}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.resultText}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: theme.primary }}
                    >
                      {result.label}
                    </ThemedText>
                    <ThemedText type="subtitle" style={{ color: theme.text }}>
                      {result.title}
                    </ThemedText>
                    {result.description ? (
                      <ThemedText
                        numberOfLines={2}
                        style={{ color: theme.textSecondary }}
                      >
                        {result.description}
                      </ThemedText>
                    ) : null}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={theme.textTertiary}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarSpacer: {
    width: 42,
  },
  resultsContent: {
    flexGrow: 1,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
  },
  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  resultsSection: {
    gap: Spacing.three,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.three,
  },
  resultIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    flex: 1,
    gap: 3,
  },
});
