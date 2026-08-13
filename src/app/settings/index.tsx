import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SettingRow = {
  label: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  route: string;
};

type SettingSection = {
  title: string;
  rows: SettingRow[];
};

const settingSections: SettingSection[] = [
  {
    title: "アカウント",
    rows: [
      {
        label: "プロフィール編集",
        description: "表示名と学歴情報の変更",
        icon: "person-outline",
        iconBg: "#E7F0FF",
        iconColor: "#1A73E8",
        route: "/settings/profile",
      },
    ],
  },
  {
    title: "アプリ設定",
    rows: [
      {
        label: "通知設定",
        description: "記録リマインド通知の管理",
        icon: "notifications-outline",
        iconBg: "#76F489",
        iconColor: "#0F6B2C",
        route: "/settings/notifications",
      },
      {
        label: "データの書き出し",
        description: "履歴のPDF/CSVエクスポート",
        icon: "download-outline",
        iconBg: "#D08514",
        iconColor: "#FFFFFF",
        route: "/settings/export",
      },
    ],
  },
  {
    title: "サポート",
    rows: [
      {
        label: "ヘルプ・よくある質問",
        icon: "help-circle-outline",
        iconBg: "#E2E7F3",
        iconColor: "#374151",
        route: "/settings/help",
      },
      {
        label: "アプリについて",
        icon: "information-circle-outline",
        iconBg: "#E2E7F3",
        iconColor: "#374151",
        route: "/settings/about",
      },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable
          style={[styles.backButton, { borderColor: Colors.light.border }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText
          type="smallBold"
          style={[styles.headerTitle, { color: theme.primary }]}
        >
          設定
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {settingSections.map((section) => (
        <View key={section.title} style={styles.sectionBlock}>
          <ThemedText
            type="smallBold"
            style={[styles.sectionTitle, { color: theme.primary }]}
          >
            {section.title}
          </ThemedText>

          <View
            style={[styles.sectionCard, { backgroundColor: theme.surface }]}
          >
            {section.rows.map((row, index) => {
              const isLast = index === section.rows.length - 1;

              return (
                <Pressable
                  key={row.label}
                  onPress={() => router.push(row.route as never)}
                  style={[
                    styles.row,
                    !isLast && {
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.light.border,
                    },
                  ]}
                >
                  <View
                    style={[styles.iconWrap, { backgroundColor: row.iconBg }]}
                  >
                    <Ionicons name={row.icon} size={24} color={row.iconColor} />
                  </View>

                  <View style={styles.rowCopy}>
                    <ThemedText
                      type="subtitle"
                      style={[styles.rowLabel, { color: theme.text }]}
                    >
                      {row.label}
                    </ThemedText>
                    {row.description ? (
                      <ThemedText
                        type="default"
                        style={[
                          styles.rowDescription,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {row.description}
                      </ThemedText>
                    ) : null}
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#BFC6D9" />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <Pressable style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#A80C0C" />
        <ThemedText type="subtitle" style={styles.logoutText}>
          ログアウト
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginHorizontal: -Spacing.five,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.five,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 38,
  },
  sectionBlock: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: Spacing.two,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  row: {
    minHeight: 82,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: {
    flex: 1,
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: Spacing.two,
    borderRadius: 16,
    minHeight: 76,
    backgroundColor: "#FDE0E0",
    borderWidth: 1,
    borderColor: "#F9CACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutText: {
    color: "#A80C0C",
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
  },
});
