import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { GakuchikaCard } from "@/features/gakuchika/components/gakuchika-card";
import { useAppStore } from "@/store/use-app-store";

export default function GakuchikaListScreen() {
  const router = useRouter();
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);

  return (
    <Screen>
      <SectionHeader
        title="ガクチカ一覧"
        subtitle="就活で話せる経験をカードとして整理する"
        actionLabel="ES作成へ"
        onActionPress={() => router.push("/es")}
      />

      <View style={styles.list}>
        {gakuchikaRecords.length ? (
          gakuchikaRecords.map((item) => (
            <GakuchikaCard
              key={item.id}
              item={item}
              onPress={() => router.push(`/gakuchika/${item.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="sparkles-outline"
            title="ガクチカ候補がまだありません"
            description="活動を記録すると、関連する経験をガクチカ候補としてまとめやすくなります。"
            actionLabel="活動を記録する"
            onActionPress={() => router.push("/activities/new")}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.four,
    paddingBottom: 40,
  },
});
