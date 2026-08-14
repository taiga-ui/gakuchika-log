import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const suggestionItems = [
  "リーダーシップを発揮した経験",
  "困難を乗り越えたエピソード",
  "自分の強みがわかる記録",
];

export default function AISearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

            <ThemedText
              type="smallBold"
              style={[styles.brandText, { color: theme.primary }]}
            >
              ガクチカログ
            </ThemedText>
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

          <View style={styles.suggestionList}>
            {suggestionItems.map((item) => (
              <Pressable key={item} style={styles.suggestionRow}>
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
              />

              <Pressable
                style={[
                  styles.submitButton,
                  { backgroundColor: theme.primary },
                ]}
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
  brandText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 26,
    marginRight: 42,
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
    position: "absolute",
    left: 0,
    right: 0,
    top: "68%",
    width: "100%",
    paddingHorizontal: 0,
    justifyContent: "center",
    minHeight: 120,
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
  submitButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
});
