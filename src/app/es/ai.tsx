import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { aiSearchService, runAiSearch } from "@/services/ai-search-service";
import { useAppStore } from "@/store/use-app-store";
import type { AiSearchState } from "@/types/ai-search";
import { getAiResultSources, type AiSource } from "@/utils/ai-search";

const suggestionItems = [
  "リーダーシップを発揮した経験",
  "困難を乗り越えたエピソード",
  "自分の強みがわかる記録",
];

export default function AISearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<AiSearchState>({
    status: "idle",
    query: "",
  });
  const activities = useAppStore((state) => state.activities);
  const projects = useAppStore((state) => state.projects);
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);

  const submitSearch = async () => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery || searchState.status === "loading") return;

    await runAiSearch(aiSearchService, normalizedQuery, setSearchState);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const openSource = (source: AiSource) => {
    if (source.kind === "activity") {
      router.push(`/activities/${source.id}` as never);
    } else if (source.kind === "project") {
      router.push(`/projects/${source.id}` as never);
    } else {
      router.push(`/gakuchika/${source.id}` as never);
    }
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable
              style={[styles.closeButton, { backgroundColor: theme.surface }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color={theme.primary} />
            </Pressable>

            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              AI検索
            </ThemedText>
            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.promptWrap}>
            <ThemedText
              type="default"
              style={[styles.promptText, { color: theme.text }]}
            >
              大雅さん、過去の経験から
              {"\n"}
              何を探しますか？
            </ThemedText>
          </View>

          {searchState.status === "idle" ? (
            <View style={styles.suggestionList}>
              {suggestionItems.map((item) => (
                <Pressable
                  key={item}
                  style={styles.suggestionRow}
                  onPress={() => setQuery(item)}
                >
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={theme.textTertiary}
                  />
                  <ThemedText
                    type="default"
                    style={[styles.suggestionText, { color: theme.text }]}
                  >
                    {item}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          ) : null}

          {searchState.status === "loading" && (
            <ThemedText
              type="small"
              style={[styles.statusText, { color: theme.textSecondary }]}
            >
              検索しています...
            </ThemedText>
          )}
          {searchState.status === "error" && (
            <ThemedText
              type="small"
              style={[styles.statusText, { color: theme.textSecondary }]}
            >
              {searchState.error.message}
            </ThemedText>
          )}
          {searchState.status === "success" ? (
            <View style={styles.resultsArea}>
              <ThemedText
                type="small"
                style={[styles.statusText, { color: theme.textSecondary }]}
              >
                {searchState.response.results.length}件の結果
              </ThemedText>
              {searchState.response.answer ? (
                <ThemedText
                  type="small"
                  style={[styles.answerText, { color: theme.textSecondary }]}
                >
                  {searchState.response.answer}
                </ThemedText>
              ) : null}
              <ScrollView
                style={styles.resultScroll}
                contentContainerStyle={styles.resultList}
                showsVerticalScrollIndicator={false}
              >
                {searchState.response.results.length ? (
                  searchState.response.results.map((result) => (
                    <View
                      key={result.id}
                      style={[
                        styles.resultCard,
                        { backgroundColor: theme.surface },
                      ]}
                    >
                      <ThemedText
                        type="subtitle"
                        style={[styles.resultTitle, { color: theme.text }]}
                      >
                        {result.title}
                      </ThemedText>
                      <ThemedText
                        type="small"
                        style={[
                          styles.resultSummary,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {result.summary}
                      </ThemedText>
                      <View style={styles.sourceList}>
                        {getAiResultSources(result, {
                          activities,
                          projects,
                          gakuchikaRecords,
                        }).map((source) =>
                          source.kind === "missing" ? (
                            <View
                              key={source.id}
                              style={[styles.sourceRow, { opacity: 0.55 }]}
                            >
                              <Ionicons
                                name="alert-circle-outline"
                                size={18}
                                color={theme.textTertiary}
                              />
                              <ThemedText
                                type="small"
                                style={{ color: theme.textTertiary, flex: 1 }}
                              >
                                関連記録が見つかりません（{source.id}）
                              </ThemedText>
                            </View>
                          ) : (
                            <Pressable
                              key={source.id}
                              style={styles.sourceRow}
                              onPress={() => openSource(source)}
                            >
                              <Ionicons
                                name="arrow-forward-circle-outline"
                                size={18}
                                color={theme.primary}
                              />
                              <View style={styles.sourceCopy}>
                                <ThemedText
                                  type="smallBold"
                                  style={{ color: theme.primary }}
                                >
                                  {source.kind === "activity"
                                    ? "活動記録"
                                    : source.kind === "project"
                                      ? "プロジェクト"
                                      : "ガクチカ"}
                                </ThemedText>
                                <ThemedText
                                  type="small"
                                  numberOfLines={1}
                                  style={{ color: theme.text }}
                                >
                                  {source.title}
                                </ThemedText>
                              </View>
                            </Pressable>
                          ),
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <EmptyState
                    icon="search-outline"
                    title="結果が見つかりません"
                    description="別のキーワードで検索してみてください。"
                  />
                )}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.searchInputContainer}>
            <View
              style={[
                styles.searchInputShell,
                { backgroundColor: theme.surface },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={28}
                color={theme.textTertiary}
              />
              <TextInput
                ref={inputRef}
                autoFocus
                placeholder="AI検索"
                placeholderTextColor={theme.textTertiary}
                style={[styles.searchInput, { color: theme.text }]}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={submitSearch}
                returnKeyType="search"
              />

              <Pressable
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: searchState.status === "loading" ? 0.5 : 1,
                  },
                ]}
                onPress={submitSearch}
                disabled={searchState.status === "loading"}
              >
                <Ionicons name="arrow-up" size={26} color={theme.textInverse} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.five,
    paddingHorizontal: 4,
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarSpacer: {
    width: 42,
  },
  promptWrap: {
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  promptText: {
    fontSize: 24,
    lineHeight: 38,
    fontWeight: "500",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  suggestionList: {
    gap: 10,
    marginTop: Spacing.one,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 6,
    width: "100%",
    maxWidth: 440,
  },
  suggestionText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "center",
  },
  searchInputContainer: {
    width: "100%",
    paddingHorizontal: 0,
    justifyContent: "center",
    minHeight: 120,
    marginTop: "auto",
    marginBottom: Platform.OS === "ios" ? 48 : 0,
  },
  searchInputShell: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 12,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    paddingVertical: 0,
  },
  statusText: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  resultsArea: {
    flex: 1,
    minHeight: 0,
    marginTop: Spacing.two,
  },
  answerText: {
    marginTop: Spacing.two,
    lineHeight: 21,
  },
  resultScroll: {
    flex: 1,
    marginTop: Spacing.three,
  },
  resultList: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  resultCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  resultTitle: {
    fontSize: 18,
  },
  resultSummary: {
    lineHeight: 21,
  },
  sourceList: {
    gap: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.two,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 32,
  },
  sourceCopy: {
    flex: 1,
    gap: 2,
  },
  submitButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
});
