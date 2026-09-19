import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function NewGakuchikaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activities = useAppStore((state) => state.activities);
  const projects = useAppStore((state) => state.projects);
  const addGakuchika = useAppStore((state) => state.addGakuchika);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?.id ?? "",
  );

  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const handleAdd = () => {
    const record = addGakuchika(selectedIds, title);
    router.replace(`/gakuchika/${record.id}` as never);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: theme.primary }]}>
          Gakuchika Log
        </ThemedText>
      </View>
      <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
        ガクチカにする経験を選択
      </ThemedText>
      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        これまでの活動記録から、ガクチカのベースにする経験を選んでください。複数選択可能です。
      </ThemedText>
      <View style={[styles.panel, { backgroundColor: theme.surface }]}>
        <FormField
          label="ガクチカのタイトル"
          value={title}
          onChangeText={setTitle}
          placeholder="例：サークルのアプリ開発プロジェクト"
        />
        <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
          プロジェクト
        </ThemedText>
        <View style={styles.projectRow}>
          {projects.map((project) => (
            <Pressable
              key={project.id}
              onPress={() => {
                setSelectedProjectId(project.id);
                setSelectedIds([]);
              }}
              style={[
                styles.projectChip,
                {
                  backgroundColor:
                    selectedProjectId === project.id
                      ? theme.primary
                      : theme.surfaceMuted,
                },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{
                  color:
                    selectedProjectId === project.id
                      ? "#FFFFFF"
                      : theme.textSecondary,
                }}
              >
                {project.name}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
          活動記録
        </ThemedText>
        {activities
          .filter((activity) => activity.projectId === selectedProjectId)
          .map((activity) => {
            const selected = selectedIds.includes(activity.id);
            return (
              <Pressable
                key={activity.id}
                onPress={() => toggle(activity.id)}
                style={[
                  styles.activity,
                  {
                    borderColor: selected ? theme.primary : Colors.light.border,
                    backgroundColor: selected
                      ? theme.surfaceSelected
                      : theme.surface,
                  },
                ]}
              >
                <Ionicons
                  name={selected ? "checkbox" : "square-outline"}
                  size={25}
                  color={selected ? theme.primary : theme.textTertiary}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={[styles.activityTitle, { color: theme.text }]}
                  >
                    {activity.title}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {activity.location || "活動記録"}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    numberOfLines={2}
                    style={{ color: theme.textSecondary, marginTop: 4 }}
                  >
                    {activity.body}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        <ThemedText style={{ color: theme.textSecondary, marginTop: 12 }}>
          選択中：{selectedIds.length}件
        </ThemedText>
        <Pressable
          disabled={!selectedIds.length || !title.trim()}
          onPress={handleAdd}
          style={[
            styles.primaryButton,
            {
              backgroundColor:
                selectedIds.length && title.trim()
                  ? theme.primary
                  : theme.textTertiary,
            },
          ]}
        >
          <ThemedText style={styles.buttonText}>追加する</ThemedText>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 38,
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  title: { fontSize: 30, lineHeight: 40, fontWeight: "700" },
  description: { fontSize: 17, lineHeight: 27, marginTop: 8, marginBottom: 24 },
  panel: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: { fontSize: 19, fontWeight: "700", marginTop: 8 },
  activity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  projectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  projectChip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9 },
  activityTitle: { fontSize: 16, fontWeight: "700", lineHeight: 22 },
  primaryButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 28,
    paddingHorizontal: 25,
    paddingVertical: 14,
    marginTop: 12,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
