import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

const tabs = ["一覧", "進行中"];

export default function GakuchikaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const gakuchikaData = useAppStore((state) => state.gakuchikaRecords).map(
    (record, index) => ({
      title: record.title,
      category: index === 0 ? "学業" : index === 1 ? "研究" : "実務",
      accent: index === 0 ? "#DDEBFF" : index === 1 ? "#E6F7EF" : "#FEEAD5",
      actionIcon: "chevron-forward" as keyof typeof Ionicons.glyphMap,
      description: record.overview,
      related: record.relatedActivityIds.length,
      status: index === 0 ? "準備中" : index === 1 ? "進行中" : "完了",
      statusColor:
        index === 0 ? "#D97706" : index === 1 ? "#2457D6" : "#2BA46A",
      progress: 35 + index * 30,
    }),
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
        ガクチカ
      </ThemedText>

      <ThemedText
        type="default"
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        これまでの経験を整理し、ESの準備を進めましょう
      </ThemedText>

      <View style={[styles.segment, { backgroundColor: theme.surfaceMuted }]}>
        {tabs.map((tab, index) => (
          <Pressable
            key={tab}
            style={[
              styles.segmentButton,
              index === 0 && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{
                color: index === 0 ? "#FFFFFF" : theme.textSecondary,
              }}
            >
              {tab}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {gakuchikaData.map((item) => (
          <Pressable
            key={item.title}
            style={[styles.card, { backgroundColor: theme.surface }]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[styles.categoryPill, { backgroundColor: item.accent }]}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {item.category}
                </ThemedText>
              </View>

              <Pressable style={styles.arrowButton}>
                <Ionicons
                  name={item.actionIcon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={theme.textTertiary}
                />
              </Pressable>
            </View>

            <ThemedText
              type="subtitle"
              style={[styles.cardTitle, { color: theme.text }]}
            >
              {item.title}
            </ThemedText>

            <ThemedText
              type="default"
              style={[styles.cardDescription, { color: theme.textSecondary }]}
            >
              {item.description}
            </ThemedText>

            <View style={styles.summaryRow}>
              <View
                style={[
                  styles.summaryBox,
                  { backgroundColor: theme.surfaceMuted },
                ]}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  関連記録数
                </ThemedText>
                <ThemedText type="subtitle" style={{ color: theme.text }}>
                  {item.related}件
                </ThemedText>
              </View>

              <View
                style={[
                  styles.summaryBox,
                  { backgroundColor: theme.surfaceMuted },
                ]}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  ES作成状況
                </ThemedText>
                <ThemedText
                  type="subtitle"
                  style={{
                    color: item.statusColor,
                  }}
                >
                  {item.status}
                </ThemedText>
              </View>
            </View>

            <View style={styles.progressRow}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                活動進捗
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {item.progress}%
              </ThemedText>
            </View>

            <View
              style={[
                styles.progressBar,
                { backgroundColor: theme.surfaceMuted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.progress}%`,
                    backgroundColor:
                      item.progress === 100 ? "#1BAF67" : "#0B7A57",
                  },
                ]}
              />
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.fab, { backgroundColor: "#0B7A57" }]}>
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
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    marginTop: 6,
    marginBottom: Spacing.four,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.four,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  list: {
    gap: Spacing.three,
    paddingBottom: 88,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 18,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryPill: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.surfaceMuted,
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
