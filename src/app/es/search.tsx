import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { useAppStore } from "@/store/use-app-store";

export default function KeywordSearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="戻る"
            style={[styles.backButton, { backgroundColor: theme.surface }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color={theme.primary} />
          </Pressable>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            キーワード検索
          </ThemedText>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
          <Ionicons
            name="search-outline"
            size={26}
            color={theme.textTertiary}
          />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setSearchQuery(value);
            }}
            placeholder="キーワード検索"
            placeholderTextColor={theme.textTertiary}
            style={[styles.input, { color: theme.text }]}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable
              accessibilityLabel="検索をクリア"
              onPress={() => {
                setQuery("");
                setSearchQuery("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={theme.textTertiary}
              />
            </Pressable>
          ) : null}
          <Pressable
            accessibilityLabel="検索"
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="arrow-up" size={26} color={theme.textInverse} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
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
