import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import type { TagId } from "@/constants/tags";
import { TAGS } from "@/constants/tags";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { toIsoDate } from "@/utils/date";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

export default function NewActivityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ projectId?: string }>();
  const addActivity = useAppStore((state) => state.addActivity);
  const projects = useAppStore((state) => state.projects);
  const tags = useAppStore((state) => state.tags);
  const lastCreatedProjectId = useAppStore(
    (state) => state.lastCreatedProjectId,
  );
  const clearLastCreatedProject = useAppStore(
    (state) => state.clearLastCreatedProject,
  );
  const addTag = useAppStore((state) => state.addTag);

  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const projects = useAppStore((state) => state.projects);
  const addActivity = useAppStore((state) => state.addActivity);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(parseDate(date));
  const [calendarMonth, setCalendarMonth] = useState(parseDate(date));
  const [location, setLocation] = useState("");
  const [projectId, setProjectId] = useState(
    params.projectId ?? projects[0]?.id,
  );
  const [tagIds, setTagIds] = useState<TagId[]>(["analysis"]);
  const [isTagModalVisible, setTagModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    if (lastCreatedProjectId) {
      setProjectId(lastCreatedProjectId);
      clearLastCreatedProject();
    }
  }, [clearLastCreatedProject, lastCreatedProjectId]);

  useEffect(() => {
    if (!projectId && projects[0]) setProjectId(projects[0].id);
  }, [projectId, projects]);

  const handleSave = () => {
    if (!projectId) return;
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
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
      categoryKey: project.categoryKey,
      projectId: project.id,
      projectId: selectedProjectId,
      tagIds: tagIds.length ? tagIds : ["analysis"],
    });
    router.replace(`/activities/${created.id}`);
  };

  const toggleTag = (tagId: TagId) => {
  const toggleTag = (tagId: (typeof TAGS)[number]["id"]) =>
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((value) => value !== tagId)
        : [...current, tagId],
    );

  const handleAddTag = () => {
    const label = newTagName.trim();
    if (!label) return;
    const tag = addTag(label);
    setTagIds((current) => [...current, tag.id]);
    setNewTagName("");
    setTagModalVisible(false);
  };

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDay + 1;
      return day > 0 && day <= totalDays ? day : null;
    });
  }, [calendarMonth]);

  const openDateModal = () => {
    const selectedDate = parseDate(date);
    setDraftDate(selectedDate);
    setCalendarMonth(selectedDate);
    setDateModalVisible(true);
  };

  const selectDate = () => {
    setDate(toIsoDate(draftDate));
    setDateModalVisible(false);
  };

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
        <View style={styles.dateField}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            日付
          </ThemedText>
          <Pressable
            onPress={openDateModal}
            style={[
              styles.dateButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <ThemedText type="default" style={{ color: theme.text }}>
              {date}
            </ThemedText>
            <Ionicons name="calendar-outline" size={21} color={theme.primary} />
          </Pressable>
        </View>
        <FormField
          label="場所"
          value={location}
          onChangeText={setLocation}
          placeholder="例: 大学 / バイト先"
        />
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            プロジェクト
          </ThemedText>
          <Pressable
            onPress={() => router.push("/projects/new")}
            hitSlop={10}
            style={[styles.addButton, { backgroundColor: theme.primarySoft }]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </Pressable>
        </View>
        {projects.length ? (
          <View style={styles.filterRow}>
            {projects.map((project) => (
              <TagChip
                key={project.id}
                label={project.name}
                selected={projectId === project.id}
                onPress={() => setProjectId(project.id)}
              />
            ))}
          </View>
        ) : (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            まだプロジェクトがありません
          </ThemedText>
        )}
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
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            タグ
          </ThemedText>
          <Pressable
            onPress={() => setTagModalVisible(true)}
            hitSlop={10}
            style={[styles.addButton, { backgroundColor: theme.primarySoft }]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </Pressable>
        </View>
        <View style={styles.filterRow}>
          {tags.map((tag) => (
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
          { backgroundColor: theme.primary, opacity: projectId ? 1 : 0.5 },
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

      <Modal
        visible={isDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.dateModalCard, { backgroundColor: theme.surface }]}
          >
            <ThemedText type="title" style={{ color: theme.text }}>
              日付
            </ThemedText>
            <View style={styles.monthHeader}>
              <Pressable
                onPress={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                hitSlop={10}
              >
                <Ionicons
                  name="chevron-back"
                  size={26}
                  color={theme.textSecondary}
                />
              </Pressable>
              <ThemedText type="subtitle" style={{ color: theme.text }}>
                {formatMonth(calendarMonth)}
              </ThemedText>
              <Pressable
                onPress={() =>
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                hitSlop={10}
              >
                <Ionicons
                  name="chevron-forward"
                  size={26}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((weekday) => (
                <ThemedText
                  key={weekday}
                  type="smallBold"
                  style={[styles.weekday, { color: theme.textSecondary }]}
                >
                  {weekday}
                </ThemedText>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const selected =
                  day !== null &&
                  draftDate.getFullYear() === calendarMonth.getFullYear() &&
                  draftDate.getMonth() === calendarMonth.getMonth() &&
                  draftDate.getDate() === day;
                return (
                  <Pressable
                    key={`${calendarMonth.toISOString()}-${index}`}
                    disabled={day === null}
                    onPress={() =>
                      day !== null &&
                      setDraftDate(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth(),
                          day,
                        ),
                      )
                    }
                    style={[
                      styles.dayButton,
                      selected && {
                        borderColor: theme.primary,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    {day !== null ? (
                      <ThemedText
                        type="default"
                        style={{ color: selected ? theme.primary : theme.text }}
                      >
                        {day}
                      </ThemedText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={() => {
                const today = new Date();
                setDraftDate(today);
                setCalendarMonth(today);
              }}
              style={styles.todayButton}
            >
              <ThemedText type="default" style={{ color: theme.text }}>
                今日の日付を設定
              </ThemedText>
            </Pressable>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setDateModalVisible(false)}
                style={[styles.dateModalAction, { borderColor: theme.border }]}
              >
                <ThemedText type="default" style={{ color: theme.text }}>
                  キャンセル
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={selectDate}
                style={[
                  styles.dateModalAction,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ThemedText type="default" style={{ color: theme.textInverse }}>
                  設定
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isTagModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTagModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <ThemedText type="subtitle" style={{ color: theme.text }}>
              タグを追加
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.text }}>
              タグ名
            </ThemedText>
            <TextInput
              value={newTagName}
              onChangeText={setNewTagName}
              placeholder="例: データ分析"
              placeholderTextColor={theme.textTertiary}
              style={[
                styles.tagInput,
                { color: theme.text, borderColor: theme.border },
              ]}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setTagModalVisible(false)}
                style={styles.modalAction}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: theme.textSecondary }}
                >
                  キャンセル
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleAddTag}
                disabled={!newTagName.trim()}
                style={[
                  styles.modalAction,
                  {
                    backgroundColor: theme.primary,
                    opacity: newTagName.trim() ? 1 : 0.5,
                  },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: theme.textInverse }}
                >
                  追加
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  dateField: {
    gap: 8,
  },
  dateButton: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.five,
    backgroundColor: "rgba(15, 23, 42, 0.32)",
  },
  modalCard: {
    borderRadius: 24,
    padding: Spacing.four,
    gap: 12,
  },
  dateModalCard: {
    borderRadius: 28,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    gap: 18,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.five,
  },
  weekdayRow: {
    flexDirection: "row",
  },
  weekday: {
    flex: 1,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayButton: {
    width: "14.2857%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "transparent",
  },
  todayButton: {
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  dateModalAction: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tagInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  modalAction: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
