import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { ActivityCategoryKey } from "@/constants/categories";
import { CATEGORY_MAP } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { PhotoAsset } from "@/types/domain";

type PhotoHeaderProps = {
  photoAsset?: PhotoAsset;
  photoLabel?: string;
  categoryKey: ActivityCategoryKey;
  title: string;
  subtitle?: string;
};

export function PhotoHeader({
  photoAsset,
  photoLabel,
  categoryKey,
  title,
  subtitle,
}: PhotoHeaderProps) {
  const theme = useTheme();
  const category = CATEGORY_MAP[categoryKey];

  if (photoAsset) {
    return (
      <View style={styles.photoCard}>
        <Image source={photoAsset} style={styles.image} contentFit="cover" />
        <View style={styles.overlay}>
          <View style={[styles.photoBadge, { backgroundColor: theme.surface }]}>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              {photoLabel ?? category.label}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.placeholderCard,
        {
          backgroundColor: category.softColor,
          borderColor: category.borderColor,
        },
      ]}
    >
      <View style={[styles.iconShell, { backgroundColor: theme.surface }]}>
        <Ionicons name={category.icon} size={30} color={category.color} />
      </View>
      <ThemedText
        type="smallBold"
        style={[styles.placeholderTitle, { color: theme.text }]}
      >
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText
          type="small"
          style={[styles.placeholderSubtitle, { color: theme.textSecondary }]}
        >
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  photoCard: {
    borderRadius: 28,
    overflow: "hidden",
    height: 220,
    backgroundColor: Colors.light.surfaceMuted,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: Spacing.four,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  photoBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeholderCard: {
    borderRadius: 28,
    padding: Spacing.five,
    minHeight: 200,
    borderWidth: 1,
    justifyContent: "center",
    gap: 12,
  },
  iconShell: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTitle: {
    fontSize: 18,
  },
  placeholderSubtitle: {
    fontSize: 13,
    lineHeight: 20,
  },
});
