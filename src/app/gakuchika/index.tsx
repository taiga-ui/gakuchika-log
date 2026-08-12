import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const tabs = ["すべて表示", "ES作成中", "活動中", "完了"];

const gakuchikaData = [
  {
    category: "サークル",
    title: "サークルでのアプリ開発",
    description:
      "大学のプログラミングサークルで、学生向けの時間割管理アプリをチームで開発した経験。",
    related: 12,
    status: "作成中(70%)",
    statusColor: "#2E6CED",
    progress: 70,
    actionIcon: "chevron-forward",
    accent: "#E9F0FF",
    icon: "people-outline",
    iconColor: "#2F68D8",
  },
  {
    category: "個人活動",
    title: "個人開発：習慣化ツール",
    description:
      "自分が抱える課題を解決するために、毎日のルーティンを記録・分析するWebアプリを一人で作成した。",
    related: 5,
    status: "未着手",
    statusColor: "#6B7280",
    progress: 45,
    actionIcon: "person-outline",
    accent: "#E8F1F7",
    icon: "person-outline",
    iconColor: "#5C738A",
  },
  {
    category: "アルバイト",
    title: "カフェでの新人教育リーダー",
    description:
      "カフェの新人教育マニュアルの改善と、新人スタッフ向けメニュー導入を提案し、定着率向上に貢献した。",
    related: 24,
    status: "完了(100%)",
    statusColor: "#1A9F67",
    progress: 100,
    actionIcon: "storefront-outline",
    accent: "#E8F6EE",
    icon: "storefront-outline",
    iconColor: "#1A9F67",
  },
];

export default function GakuchikaScreen() {
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
