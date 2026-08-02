import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function ProfileScreen() {
  const theme = useTheme();
  const profile = useAppStore((state) => state.profile);
  const activities = useAppStore((state) => state.activities);
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);

  const withPhotoCount = activities.filter(
    (activity) => activity.photoAsset,
  ).length;

  return (
    <Screen>
      <SectionHeader
        title="マイページ"
        subtitle="統計と設定をまとめた管理エリア"
      />

      <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primarySoft }]}>
          <Ionicons name="person" size={28} color={theme.primary} />
        </View>
        <View style={styles.profileCopy}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            {profile.name}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {profile.school} / {profile.faculty}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {profile.grade} / {profile.target}
          </ThemedText>
        </View>
      </View>

      <View style={styles.statRow}>
        <StatCard
          label="活動数"
          value={`${activities.length}`}
          helper="ローカル保存済み"
        />
        <StatCard
          label="ガクチカ数"
          value={`${gakuchikaRecords.length}`}
          helper="候補として整理済み"
          tone="accent"
        />
      </View>
      <View style={styles.statRow}>
        <StatCard
          label="写真あり"
          value={`${withPhotoCount}`}
          helper="成果物も管理できる"
          tone="success"
        />
        <StatCard
          label="設定状態"
          value="標準"
          helper="MVPの土台"
          tone="neutral"
        />
      </View>

      <View style={[styles.settingsCard, { backgroundColor: theme.surface }]}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          設定
        </ThemedText>
        {["テーマ切り替え", "タグ編集", "ヘルプとサポート"].map((item) => (
          <Pressable
            key={item}
            style={[
              styles.settingRow,
              { borderBottomColor: Colors.light.border },
            ]}
          >
            <ThemedText type="small" style={{ color: theme.text }}>
              {item}
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.textTertiary}
            />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.logoutButton, { backgroundColor: theme.surface }]}
      >
        <ThemedText type="smallBold" style={{ color: theme.danger }}>
          ログアウト
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 26,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  statRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  settingsCard: {
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 2,
    marginTop: Spacing.four,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  logoutButton: {
    marginTop: Spacing.four,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
