import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type NotificationRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  withBorder?: boolean;
};

function NotificationRow({
  icon,
  iconBg,
  iconColor,
  label,
  enabled,
  onToggle,
  withBorder,
}: NotificationRowProps) {
  return (
    <View style={[styles.row, withBorder && styles.rowBorder]}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <ThemedText type="subtitle" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <View style={styles.switchWrap}>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: "#DCE2F2", true: "#34C759" }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#DCE2F2"
        />
        <Ionicons
          name={enabled ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={enabled ? "#2563EB" : "#9CA3AF"}
        />
      </View>
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [allowAll, setAllowAll] = useState(true);
  const [badge, setBadge] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable style={styles.headerAction} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            設定
          </ThemedText>
        </Pressable>

        <ThemedText
          type="subtitle"
          style={[styles.headerTitle, { color: theme.text }]}
        >
          通知設定
        </ThemedText>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.sectionBlock}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          プッシュ通知
        </ThemedText>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <NotificationRow
            icon="notifications-outline"
            iconBg="#E9F2FF"
            iconColor="#1E66D0"
            label="すべての通知を許可"
            enabled={allowAll}
            onToggle={setAllowAll}
            withBorder
          />
          <NotificationRow
            icon="refresh-circle-outline"
            iconBg="#FCECEC"
            iconColor="#C81E1E"
            label="アプリアイコンにバッジを表示"
            enabled={badge}
            onToggle={setBadge}
          />
        </View>
        <ThemedText
          type="small"
          style={[styles.helperText, { color: theme.textSecondary }]}
        >
          アプリからの重要なお知らせやリマインドを受け取ることができます。
        </ThemedText>
      </View>

      <View style={styles.sectionBlock}>
        <ThemedText
          type="smallBold"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          記録リマインド
        </ThemedText>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <NotificationRow
            icon="calendar-outline"
            iconBg="#E8F7EC"
            iconColor="#198754"
            label="毎日の記録リマインド"
            enabled={dailyReminder}
            onToggle={setDailyReminder}
            withBorder
          />

          <View style={styles.timeRow}>
            <ThemedText type="subtitle" style={{ color: theme.text }}>
              通知時間
            </ThemedText>
            <View style={styles.timePill}>
              <ThemedText type="subtitle" style={{ color: theme.text }}>
                21:00
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 58,
    marginHorizontal: -Spacing.five,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.five,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 86,
  },
  headerSpacer: {
    width: 86,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  sectionBlock: {
    marginBottom: Spacing.five,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: 20,
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
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
  },
  switchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helperText: {
    marginTop: Spacing.two,
    fontSize: 14,
    lineHeight: 22,
  },
  timeRow: {
    minHeight: 74,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timePill: {
    minWidth: 96,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E5E8F4",
    alignItems: "center",
    justifyContent: "center",
  },
});
