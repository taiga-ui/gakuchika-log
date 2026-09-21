import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function GakuchikaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const records = useAppStore((state) => state.gakuchikaRecords);
  const [activeList, setActiveList] = useState<"draft" | "saved">("draft");
  const visibleRecords = records.filter((record) =>
    activeList === "saved" ? Boolean(record.savedAt) : !record.savedAt,
  );

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
            style={[styles.brand, { color: theme.primary }]}
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
      <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
        ガクチカ
      </ThemedText>
      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        これまでの経験から、就活で使いたい経験を整理できます。
      </ThemedText>
      <Pressable
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push("/gakuchika/new" as never)}
      >
        <Ionicons name="add" size={25} color="#FFFFFF" />
        <ThemedText style={styles.buttonText}>ガクチカを追加</ThemedText>
      </Pressable>
      <View style={[styles.segment, { backgroundColor: theme.surfaceMuted }]}>
        {(
          [
            ["draft", "作成中"],
            ["saved", "保存済み"],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setActiveList(value)}
            style={[
              styles.segmentButton,
              activeList === value && {
                backgroundColor: theme.surface,
                borderColor: Colors.light.border,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{
                color: activeList === value ? theme.text : theme.textSecondary,
              }}
            >
              {label}（
              {
                records.filter((record) =>
                  value === "saved" ? Boolean(record.savedAt) : !record.savedAt,
                ).length
              }
              ）
            </ThemedText>
          </Pressable>
        ))}
      </View>
      <View style={styles.list}>
        {visibleRecords.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
              {activeList === "saved"
                ? "保存済みのガクチカはありません"
                : "作成中のガクチカはありません"}
            </ThemedText>
            <ThemedText style={{ color: theme.textSecondary }}>
              {activeList === "saved"
                ? "ESを書き終えたら、保存してここから見返せます。"
                : "活動記録からガクチカを追加して整理を始めましょう。"}
            </ThemedText>
          </View>
        ) : (
          visibleRecords.map((record) => (
            <View
              key={record.id}
              style={[styles.card, { backgroundColor: theme.surface }]}
            >
              <ThemedText
                type="subtitle"
                style={[styles.cardTitle, { color: theme.text }]}
              >
                {record.title}
              </ThemedText>
              <View
                style={[
                  styles.relatedPill,
                  { backgroundColor: theme.primarySoft },
                ]}
              >
                <ThemedText style={{ color: theme.textSecondary }}>
                  関連記録：{record.relatedActivityIds.length}件
                </ThemedText>
              </View>
              <View style={styles.divider} />
              <Pressable
                style={[
                  styles.writeButton,
                  { backgroundColor: Colors.light.success },
                ]}
                onPress={() => router.push(`/gakuchika/${record.id}` as never)}
              >
                <ThemedText style={styles.buttonText}>
                  {record.savedAt ? "保存済みを開く" : "このガクチカを書く"}
                </ThemedText>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={[styles.fab, { backgroundColor: "#0B7A57" }]}
        onPress={() => router.push("/projects/new")}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  brandWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
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
  brand: { fontSize: 18, lineHeight: 26 },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 38, lineHeight: 48, fontWeight: "700" },
  description: { fontSize: 18, lineHeight: 29, marginTop: 8, maxWidth: 650 },
  addButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 15,
    marginTop: 28,
    marginBottom: 58,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 11,
    paddingVertical: 11,
  },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  list: { gap: 32, paddingBottom: 32 },
  emptyState: {
    borderRadius: 16,
    padding: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  card: {
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#AEB4C4",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: { fontSize: 27, lineHeight: 36, fontWeight: "700" },
  relatedPill: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 26,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginTop: 28,
    marginBottom: 16,
  },
  writeButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 14,
  },
});
