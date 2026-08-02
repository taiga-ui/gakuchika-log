import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { PhotoHeader } from "@/components/ui/photo-header";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from "@/constants/categories";
import { PHOTO_PRESETS } from "@/constants/photo-presets";
import { TAGS } from "@/constants/tags";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { toIsoDate } from "@/utils/date";

export default function NewActivityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const addActivity = useAppStore((state) => state.addActivity);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [location, setLocation] = useState("");
  const [categoryKey, setCategoryKey] =
    useState<(typeof ACTIVITY_CATEGORIES)[number]["key"]>("research");
  const [tagIds, setTagIds] = useState<Array<(typeof TAGS)[number]["id"]>>([
    "analysis",
  ]);
  const [photoPresetKey, setPhotoPresetKey] =
    useState<(typeof PHOTO_PRESETS)[number]["key"]>("none");

  const selectedPhotoPreset = useMemo(
    () =>
      PHOTO_PRESETS.find((preset) => preset.key === photoPresetKey) ??
      PHOTO_PRESETS[0],
    [photoPresetKey],
  );

  const selectedCategory = CATEGORY_MAP[categoryKey];

  const handleSave = () => {
    const created = addActivity({
      title: title.trim() || "新しい活動",
      body: body.trim() || "記録を追加して、あとで振り返れるようにする。",
      date,
      location: location.trim() || undefined,
      categoryKey,
      tagIds: tagIds.length ? tagIds : ["analysis"],
      photoAsset: selectedPhotoPreset.source ?? null,
      photoLabel: selectedPhotoPreset.label,
    });

    router.replace(`/activities/${created.id}`);
  };

  const toggleTag = (tagId: (typeof TAGS)[number]["id"]) => {
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((value) => value !== tagId)
        : [...current, tagId],
    );
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={20} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            新規記録
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            必須入力を少なくして、すぐ残せるようにする
          </ThemedText>
        </View>
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
            保存
          </ThemedText>
        </Pressable>
      </View>

      <PhotoHeader
        photoAsset={selectedPhotoPreset.source ?? null}
        photoLabel={selectedPhotoPreset.label}
        categoryKey={categoryKey}
        title={title || "タイトル未設定"}
        subtitle={body || "ここに記録内容を入力"}
      />

      <View style={styles.section}>
        <FormField
          label="タイトル"
          value={title}
          onChangeText={setTitle}
          placeholder="例: 学園祭の導線改善"
        />
        <FormField
          label="内容"
          value={body}
          onChangeText={setBody}
          placeholder="何をしたか、何に苦労したか、工夫したかを書き残す"
          multiline
          numberOfLines={5}
          helperText="後でESや面接に転用できるように、短くても事実を残す。"
        />
        <FormField
          label="日付"
          value={date}
          onChangeText={setDate}
          placeholder="2026-07-28"
          helperText="手入力でも、後で編集できる。"
        />
        <FormField
          label="場所"
          value={location}
          onChangeText={setLocation}
          placeholder="例: 大学 / バイト先 / サークル"
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          カテゴリ
        </ThemedText>
        <View style={styles.filterRow}>
          {ACTIVITY_CATEGORIES.map((category) => (
            <TagChip
              key={category.key}
              label={category.label}
              selected={categoryKey === category.key}
              onPress={() => setCategoryKey(category.key)}
              tone={category.softColor}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          タグ
        </ThemedText>
        <View style={styles.filterRow}>
          {TAGS.map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.label}
              selected={tagIds.includes(tag.id)}
              onPress={() => toggleTag(tag.id)}
              tone={tag.softColor}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          写真・成果物
        </ThemedText>
        <View style={styles.photoPresetRow}>
          {PHOTO_PRESETS.map((preset) => (
            <Pressable
              key={preset.key}
              style={[
                styles.photoPreset,
                {
                  backgroundColor: theme.surface,
                  borderColor:
                    photoPresetKey === preset.key
                      ? theme.primary
                      : Colors.light.border,
                },
              ]}
              onPress={() => setPhotoPresetKey(preset.key)}
            >
              <View
                style={[
                  styles.photoPreview,
                  { backgroundColor: theme.surfaceMuted },
                ]}
              >
                {preset.source ? (
                  <View
                    style={[
                      styles.previewImage,
                      { backgroundColor: theme.surfaceMuted },
                    ]}
                  />
                ) : (
                  <Ionicons
                    name="image-outline"
                    size={22}
                    color={theme.textSecondary}
                  />
                )}
              </View>
              <ThemedText type="smallBold" style={{ color: theme.text }}>
                {preset.label}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {preset.description}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          今の記録の見え方
        </ThemedText>
        <View
          style={[
            styles.previewBox,
            {
              backgroundColor: selectedCategory.softColor,
              borderColor: selectedCategory.borderColor,
            },
          ]}
        >
          <ThemedText
            type="smallBold"
            style={{ color: selectedCategory.color }}
          >
            {selectedCategory.label}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            写真がない場合でも、カテゴリ色とアイコンで見分けられる設計。
          </ThemedText>
        </View>
      </View>

      <Pressable
        style={[styles.fullButton, { backgroundColor: theme.primary }]}
        onPress={handleSave}
      >
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          この内容で保存する
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: Spacing.four,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  saveButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  section: {
    marginTop: Spacing.four,
    gap: 12,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photoPresetRow: {
    gap: 12,
  },
  photoPreset: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.four,
    gap: 8,
  },
  photoPreview: {
    width: "100%",
    height: 100,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  previewBox: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    gap: 8,
  },
  fullButton: {
    marginTop: Spacing.five,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: Spacing.six,
  },
});
