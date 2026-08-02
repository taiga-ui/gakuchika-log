import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { SectionHeader } from "@/components/ui/section-header";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function AlbumsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activities = useAppStore((state) => state.activities);
  const withPhoto = activities.filter((activity) => activity.photoAsset);

  return (
    <Screen>
      <SectionHeader
        title="アルバム"
        subtitle="写真・成果物・画面キャプチャをまとめる"
        actionLabel="活動を追加"
        onActionPress={() => router.push("/activities/new")}
      />

      {withPhoto.length ? (
        <View style={styles.grid}>
          {withPhoto.map((activity) => (
            <Pressable
              key={activity.id}
              onPress={() => router.push(`/activities/${activity.id}`)}
              style={[styles.card, { backgroundColor: theme.surface }]}
            >
              <View style={styles.imageShell}>
                <Image
                  source={activity.photoAsset as number}
                  style={styles.image}
                  contentFit="cover"
                />
                <View style={styles.imageOverlay}>
                  <View
                    style={[styles.badge, { backgroundColor: theme.surface }]}
                  >
                    <Ionicons
                      name="images-outline"
                      size={14}
                      color={theme.primary}
                    />
                    <ThemedText
                      type="smallBold"
                      style={{ color: theme.primary }}
                    >
                      {activity.photoLabel ?? "写真"}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <ThemedText
                type="smallBold"
                style={{ color: theme.text }}
                numberOfLines={2}
              >
                {activity.title}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
                numberOfLines={2}
              >
                {activity.body}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      ) : (
        <EmptyState
          icon="image-outline"
          title="写真つきの記録はまだありません"
          description="成果物、GitHub画面、アプリ画面、賞状などを写真として残せる設計です。"
          actionLabel="新規記録"
          onActionPress={() => router.push("/activities/new")}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.four,
    paddingBottom: 40,
  },
  card: {
    width: "48%",
    borderRadius: 24,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  imageShell: {
    borderRadius: 20,
    overflow: "hidden",
    height: 150,
    backgroundColor: Colors.light.surfaceMuted,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    padding: 10,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
