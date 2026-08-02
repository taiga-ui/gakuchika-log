import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Colors, Spacing } from "@/constants/theme";
import { ActivityCard } from "@/features/activities/components/activity-card";
import { GakuchikaCard } from "@/features/gakuchika/components/gakuchika-card";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { calculateStreak, countRecordsThisMonth } from "@/utils/date";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const profile = useAppStore((state) => state.profile);
  const activities = useAppStore((state) => state.activities);
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);

  const recentActivities = [...activities]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 2);
  const featuredGakuchika = gakuchikaRecords.slice(0, 2);

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              Gakuchika Log
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {profile.school} / {profile.faculty}
            </ThemedText>
          </View>
          <Pressable
            style={[styles.profileChip, { backgroundColor: theme.surface }]}
            onPress={() => router.push("/profile")}
          >
            <ThemedText type="smallBold" style={{ color: theme.text }}>
              {profile.name}
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type="subtitle"
          style={[styles.heroTitle, { color: theme.text }]}
        >
          こんにちは、{profile.name.split(" ")[0]}さん。
          {"\n"}今日も大学生活を記録しよう。
        </ThemedText>
        <ThemedText
          type="default"
          style={[styles.heroCopy, { color: theme.textSecondary }]}
        >
          活動を積み重ねて、ガクチカ・自己PR・面接の材料をその場で見返せる土台を作ります。
        </ThemedText>

        <View style={styles.ctaRow}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/activities/new")}
          >
            <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
              今日の活動を記録
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: theme.surface }]}
            onPress={() => router.push("/gakuchika")}
          >
            <ThemedText type="smallBold" style={{ color: theme.text }}>
              ガクチカを見る
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          label="今月の記録数"
          value={`${countRecordsThisMonth(activities)}`}
          helper="今月の積み上げ"
        />
        <StatCard
          label="連続記録"
          value={`${calculateStreak(activities)}`}
          helper="日連続"
          tone="success"
        />
      </View>

      <SectionHeader
        title="最近の活動"
        subtitle="直近の記録をすぐに見返せるようにする"
        actionLabel="一覧へ"
        onActionPress={() => router.push("/activities")}
      />
      <View style={styles.cardStack}>
        {recentActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={() => router.push(`/activities/${activity.id}`)}
          />
        ))}
      </View>

      <SectionHeader
        title="ガクチカ候補"
        subtitle="ESや面接で使いやすい経験を集約"
        actionLabel="ガクチカ一覧"
        onActionPress={() => router.push("/gakuchika")}
      />
      <View style={styles.cardStack}>
        {featuredGakuchika.map((item) => (
          <GakuchikaCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/gakuchika/${item.id}`)}
          />
        ))}
      </View>

      <View style={styles.bottomLinkRow}>
        <Pressable
          style={[styles.bottomLink, { backgroundColor: theme.surface }]}
          onPress={() => router.push("/es")}
        >
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            ES作成を開く
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.bottomLink, { backgroundColor: theme.surface }]}
          onPress={() => router.push("/calendar")}
        >
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            カレンダーを見る
          </ThemedText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.four,
    marginBottom: Spacing.six,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  profileChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  heroTitle: {
    marginTop: 4,
  },
  heroCopy: {
    fontSize: 15,
    lineHeight: 24,
  },
  ctaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButton: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.three,
    marginBottom: Spacing.seven,
  },
  cardStack: {
    gap: Spacing.four,
    marginBottom: Spacing.seven,
  },
  bottomLinkRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginBottom: Spacing.six,
  },
  bottomLink: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
