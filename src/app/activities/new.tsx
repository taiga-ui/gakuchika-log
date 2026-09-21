import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import type { TagId } from "@/constants/tags";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { toIsoDate } from "@/utils/date";

export default function NewActivityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { projectId: initialProjectId } = useLocalSearchParams<{
    projectId?: string;
  }>();
  const projects = useAppStore((state) => state.projects);
  const tags = useAppStore((state) => state.tags);
  const addActivity = useAppStore((state) => state.addActivity);
  const addTag = useAppStore((state) => state.addTag);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [location, setLocation] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId ?? projects[0]?.id ?? "",
  );
  const [selectedTagIds, setSelectedTagIds] = useState<TagId[]>(["analysis"]);
  const [newTagName, setNewTagName] = useState("");

  const toggleTag = (tagId: TagId) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((value) => value !== tagId)
        : [...current, tagId],
    );
  };

  const handleAddTag = () => {
    const label = newTagName.trim();
    if (!label) return;
    const tag = addTag(label);
    setSelectedTagIds((current) => [...current, tag.id]);
    setNewTagName("");
  };

  const handleSave = () => {
    const project = projects.find((item) => item.id === selectedProjectId);
    if (!title.trim() || !body.trim() || !project) return;
    const created = addActivity({
      title: title.trim(),
      body: body.trim(),
      date,
      location: location.trim() || undefined,
      categoryKey: project.category,
      projectId: project.id,
      tagIds: selectedTagIds.length ? selectedTagIds : ["analysis"],
    });
    router.replace(`/activities/${created.id}`);
  };

  const canSave = Boolean(title.trim() && body.trim() && selectedProjectId);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          新規記録
        </ThemedText>
      </View>

      <ThemedText type="title" style={{ color: theme.text }}>
        活動を記録
      </ThemedText>

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
          {tags.map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.label}
              selected={selectedTagIds.includes(tag.id)}
              onPress={() => toggleTag(tag.id)}
              tone={tag.softColor}
            />
          ))}
        </View>
        <View style={styles.newTagRow}>
          <View style={styles.newTagInput}>
            <FormField
              label=""
              value={newTagName}
              onChangeText={setNewTagName}
              placeholder="新しいタグ"
            />
          </View>
          <Pressable
            onPress={handleAddTag}
            disabled={!newTagName.trim()}
            style={[
              styles.addTagButton,
              {
                backgroundColor: theme.primary,
                opacity: newTagName.trim() ? 1 : 0.5,
              },
            ]}
          >
            <Ionicons name="add" size={20} color={theme.textInverse} />
          </Pressable>
        </View>
      </View>

      <Pressable
        style={[
          styles.saveButton,
          { backgroundColor: theme.primary, opacity: canSave ? 1 : 0.5 },
        ]}
        onPress={handleSave}
        disabled={!canSave}
      >
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          保存
        </ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: Spacing.four,
  },
  section: {
    gap: 12,
    marginTop: Spacing.four,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  newTagRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  newTagInput: {
    flex: 1,
  },
  addTagButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  saveButton: {
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: Spacing.five,
  },
});
