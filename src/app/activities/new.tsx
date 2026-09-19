import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import { TAGS } from "@/constants/tags";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { toIsoDate } from "@/utils/date";

export default function NewActivityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const projects = useAppStore((state) => state.projects);
  const addActivity = useAppStore((state) => state.addActivity);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [location, setLocation] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(
    projectId ?? projects[0]?.id ?? "",
  );
  const [tagIds, setTagIds] = useState<Array<(typeof TAGS)[number]["id"]>>([
    "analysis",
  ]);

  const handleSave = () => {
    if (!title.trim() || !body.trim() || !selectedProjectId) return;
    const created = addActivity({
      title: title.trim(),
      body: body.trim(),
      date,
      location: location.trim() || undefined,
      projectId: selectedProjectId,
      tagIds: tagIds.length ? tagIds : ["analysis"],
    });
    router.replace(`/activities/${created.id}`);
  };
  const toggleTag = (tagId: (typeof TAGS)[number]["id"]) =>
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((value) => value !== tagId)
        : [...current, tagId],
    );

  return (
    <Screen>
      <View style={[styles.headerRow, { marginTop: Spacing.two }]}>
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
        </View>
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={!title.trim() || !body.trim() || !selectedProjectId}
        >
          <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
            保存
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.section}>
        <FormField
          label="タイトル"
          value={title}
          onChangeText={setTitle}
          placeholder="例: UIを改善した"
        />
        <FormField
          label="内容"
          value={body}
          onChangeText={setBody}
          placeholder="何をしたか、工夫したかを書き残す"
          multiline
          numberOfLines={5}
        />
        <FormField
          label="日付"
          value={date}
          onChangeText={setDate}
          placeholder="2026-09-19"
        />
        <FormField
          label="場所"
          value={location}
          onChangeText={setLocation}
          placeholder="例: 大学 / バイト先"
        />
      </View>
      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          プロジェクト
        </ThemedText>
        <View style={styles.filterRow}>
          {projects.map((project) => (
            <TagChip
              key={project.id}
              label={project.name}
              selected={selectedProjectId === project.id}
              onPress={() => setSelectedProjectId(project.id)}
            />
          ))}
        </View>
        {!projects.length ? (
          <ThemedText style={{ color: theme.textSecondary }}>
            先にプロジェクトを作成してください。
          </ThemedText>
        ) : null}
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
      <Pressable
        style={[
          styles.fullButton,
          {
            backgroundColor:
              title.trim() && body.trim() && selectedProjectId
                ? theme.primary
                : theme.textTertiary,
          },
        ]}
        onPress={handleSave}
        disabled={!title.trim() || !body.trim() || !selectedProjectId}
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
  saveButton: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  section: { marginTop: Spacing.four, gap: 12 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fullButton: {
    marginTop: Spacing.five,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: Spacing.six,
  },
});
