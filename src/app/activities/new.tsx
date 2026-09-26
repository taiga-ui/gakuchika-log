import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import { TagChip } from "@/components/ui/tag-chip";
import type { TagId } from "@/constants/tags";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore, usePersistenceStore } from "@/store/use-app-store";
import { formatMonthLabel, parseIsoDate, toIsoDate } from "@/utils/date";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstGridDate = new Date(firstDay);
  firstGridDate.setDate(firstDay.getDate() - firstDay.getDay());
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const weekCount = Math.ceil((firstDay.getDay() + daysInMonth) / 7);

  return Array.from({ length: weekCount * 7 }, (_, index) => {
    const date = new Date(firstGridDate);
    date.setDate(firstGridDate.getDate() + index);
    return date;
  });
}

export default function NewActivityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { activityId, projectId: initialProjectId } = useLocalSearchParams<{
    activityId?: string;
    projectId?: string;
  }>();
  const projects = useAppStore((state) => state.projects);
  const tags = useAppStore((state) => state.tags);
  const activityToEdit = useAppStore((state) =>
    state.activities.find((activity) => activity.id === activityId),
  );
  const lastCreatedProjectId = useAppStore(
    (state) => state.lastCreatedProjectId,
  );
  const addActivity = useAppStore((state) => state.addActivity);
  const updateActivity = useAppStore((state) => state.updateActivity);
  const addTag = useAppStore((state) => state.addTag);
  const clearLastCreatedProject = useAppStore(
    (state) => state.clearLastCreatedProject,
  );
  const persistenceStatus = usePersistenceStore(
    (state) => state.persistenceStatus,
  );
  const [title, setTitle] = useState(() => activityToEdit?.title ?? "");
  const [body, setBody] = useState(() => activityToEdit?.body ?? "");
  const [date, setDate] = useState(
    () => activityToEdit?.date ?? toIsoDate(new Date()),
  );
  const [location, setLocation] = useState(
    () => activityToEdit?.location ?? "",
  );
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId ?? activityToEdit?.projectId ?? projects[0]?.id ?? "",
  );
  const [selectedTagIds, setSelectedTagIds] = useState<TagId[]>(
    () => activityToEdit?.tagIds ?? ["analysis"],
  );
  const [newTagName, setNewTagName] = useState("");
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const selectedDate = parseIsoDate(date);
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  });
  const [draftDate, setDraftDate] = useState(date);
  const [errors, setErrors] = useState({
    title: "",
    body: "",
    date: "",
    project: "",
  });
  const hasMounted = useRef(false);

  const today = new Date();
  const todayIsoDate = toIsoDate(today);
  const calendarDays = getCalendarDays(calendarMonth);
  const canGoToNextMonth =
    calendarMonth.getFullYear() < today.getFullYear() ||
    (calendarMonth.getFullYear() === today.getFullYear() &&
      calendarMonth.getMonth() < today.getMonth());

  const openDateModal = () => {
    const selectedDate = parseIsoDate(date);
    setDraftDate(date);
    setCalendarMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
    setIsDateModalVisible(true);
  };

  const changeCalendarMonth = (offset: number) => {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      clearLastCreatedProject();
      return;
    }
    if (
      lastCreatedProjectId &&
      projects.some((project) => project.id === lastCreatedProjectId)
    ) {
      setSelectedProjectId(lastCreatedProjectId);
      clearLastCreatedProject();
    } else if (!selectedProjectId && projects.length) {
      const initialProject = initialProjectId
        ? projects.find((project) => project.id === initialProjectId)
        : projects[0];
      setSelectedProjectId(initialProject?.id ?? projects[0].id);
    }
  }, [
    clearLastCreatedProject,
    initialProjectId,
    lastCreatedProjectId,
    projects,
    selectedProjectId,
  ]);

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
    setIsTagModalVisible(false);
  };

  const handleSave = () => {
    const project = projects.find((item) => item.id === selectedProjectId);
    const nextErrors = {
      title: title.trim() ? "" : "タイトルを入力してください。",
      body: body.trim() ? "" : "内容を入力してください。",
      date: date.trim() ? "" : "日付を選択してください。",
      project: project ? "" : "Projectを選択してください。",
    };
    setErrors(nextErrors);
    if (!title.trim() || !body.trim() || !date.trim() || !project) {
      return;
    }
    if (activityToEdit) {
      updateActivity(activityToEdit.id, {
        title: title.trim(),
        body: body.trim(),
        date,
        location: location.trim() || undefined,
        categoryKey: project.category,
        projectId: project.id,
        tagIds: selectedTagIds.length ? selectedTagIds : ["analysis"],
      });
      router.replace(`/activities/${activityToEdit.id}`);
      return;
    }
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
        <Pressable onPress={() => router.back()} style={{ marginTop: 10 }}>
          <Ionicons name="close" size={24} color={theme.text} />
        </Pressable>
        <ThemedText
          type="smallBold"
          style={{ color: theme.primary, marginTop: 10 }}
        >
          {activityToEdit ? "活動を編集" : "新規記録"}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <FormField
          label="タイトル"
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            if (value.trim())
              setErrors((current) => ({ ...current, title: "" }));
          }}
          placeholder="例: UIを改善した"
          errorText={errors.title}
        />
        <FormField
          label="内容"
          value={body}
          onChangeText={(value) => {
            setBody(value);
            if (value.trim())
              setErrors((current) => ({ ...current, body: "" }));
          }}
          placeholder="何をしたか、工夫したかを書き残す"
          multiline
          numberOfLines={5}
          errorText={errors.body}
        />
        <View style={styles.dateField}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            日付
          </ThemedText>
          <Pressable
            accessibilityLabel="日付を選択"
            onPress={openDateModal}
            style={[
              styles.dateButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <ThemedText style={{ color: theme.text }}>{date}</ThemedText>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
          {errors.date ? (
            <ThemedText type="small" style={{ color: theme.danger }}>
              {errors.date}
            </ThemedText>
          ) : null}
        </View>
        <FormField
          label="場所"
          value={location}
          onChangeText={setLocation}
          placeholder="例: 大学 / バイト先"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.headingRow}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            プロジェクト
          </ThemedText>
          <Pressable
            accessibilityLabel="プロジェクトを追加"
            hitSlop={8}
            onPress={() => router.push("/projects/new")}
            style={[
              styles.smallAddButton,
              { backgroundColor: theme.primarySoft },
            ]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </Pressable>
        </View>
        <View style={styles.filterRow}>
          {projects.map((project) => (
            <TagChip
              key={project.id}
              label={project.name}
              selected={selectedProjectId === project.id}
              onPress={() => {
                setSelectedProjectId(project.id);
                setErrors((current) => ({ ...current, project: "" }));
              }}
            />
          ))}
        </View>
        {!projects.length ? (
          <ThemedText style={{ color: theme.textSecondary }}>
            まだプロジェクトがありません。
          </ThemedText>
        ) : null}
        {errors.project ? (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {errors.project}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.headingRow}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            タグ
          </ThemedText>
          <Pressable
            accessibilityLabel="タグを追加"
            hitSlop={8}
            onPress={() => setIsTagModalVisible(true)}
            style={[
              styles.smallAddButton,
              { backgroundColor: theme.primarySoft },
            ]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </Pressable>
        </View>
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
      </View>

      <Modal
        visible={isTagModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTagModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <ThemedText type="subtitle" style={{ color: theme.text }}>
              タグを追加
            </ThemedText>
            <FormField
              label="タグ名"
              value={newTagName}
              onChangeText={setNewTagName}
              placeholder="例: データ分析"
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setNewTagName("");
                  setIsTagModalVisible(false);
                }}
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
                  styles.modalPrimaryAction,
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

      <Modal
        visible={isDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDateModalVisible(false)}
      >
        <View style={styles.dateModalBackdrop}>
          <View
            style={[styles.dateModalCard, { backgroundColor: theme.surface }]}
          >
            <ThemedText type="title" style={{ color: theme.text }}>
              日付
            </ThemedText>

            <View style={styles.monthHeader}>
              <Pressable
                accessibilityLabel="前の月"
                hitSlop={10}
                onPress={() => changeCalendarMonth(-1)}
                style={styles.monthArrow}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={theme.textSecondary}
                />
              </Pressable>
              <ThemedText type="subtitle" style={{ color: theme.text }}>
                {formatMonthLabel(toIsoDate(calendarMonth))}
              </ThemedText>
              <Pressable
                accessibilityLabel="次の月"
                disabled={!canGoToNextMonth}
                hitSlop={10}
                onPress={() => changeCalendarMonth(1)}
                style={styles.monthArrow}
              >
                <Ionicons
                  name="chevron-forward"
                  size={28}
                  color={canGoToNextMonth ? theme.textSecondary : theme.border}
                />
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((weekday) => (
                <ThemedText
                  key={weekday}
                  type="smallBold"
                  style={[
                    styles.calendarCellText,
                    { color: theme.textSecondary },
                  ]}
                >
                  {weekday}
                </ThemedText>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((calendarDay) => {
                const dayIsoDate = toIsoDate(calendarDay);
                const isCurrentMonth =
                  calendarDay.getMonth() === calendarMonth.getMonth();
                const isFuture = dayIsoDate > todayIsoDate;
                const isSelected = dayIsoDate === draftDate;
                return (
                  <Pressable
                    key={dayIsoDate}
                    disabled={!isCurrentMonth || isFuture}
                    onPress={() => setDraftDate(dayIsoDate)}
                    style={[
                      styles.calendarCell,
                      isSelected && {
                        borderColor: theme.primary,
                        borderWidth: 2,
                        borderRadius: 22,
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        color:
                          !isCurrentMonth || isFuture
                            ? theme.textTertiary
                            : isSelected
                              ? theme.primary
                              : theme.text,
                      }}
                    >
                      {calendarDay.getDate()}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => setDraftDate(todayIsoDate)}
              style={styles.todayButton}
            >
              <ThemedText style={{ color: theme.text }}>
                今日の日付を設定
              </ThemedText>
            </Pressable>

            <View style={styles.dateModalActions}>
              <Pressable
                onPress={() => setIsDateModalVisible(false)}
                style={[styles.dateModalAction, { borderColor: theme.border }]}
              >
                <ThemedText style={{ color: theme.text }}>
                  キャンセル
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDate(draftDate);
                  setIsDateModalVisible(false);
                }}
                style={[
                  styles.dateModalAction,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ThemedText style={{ color: theme.textInverse }}>
                  設定
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={[
          styles.saveButton,
          { backgroundColor: theme.primary, opacity: canSave ? 1 : 0.5 },
        ]}
        onPress={handleSave}
        disabled={persistenceStatus === "saving"}
      >
        <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
          {activityToEdit ? "更新" : "保存"}
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
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallAddButton: {
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
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.five,
    backgroundColor: "rgba(22, 32, 51, 0.35)",
  },
  modalCard: {
    borderRadius: 22,
    padding: Spacing.five,
    gap: Spacing.four,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalAction: {
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalPrimaryAction: {
    minWidth: 76,
  },
  dateModalBackdrop: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    backgroundColor: "rgba(22, 32, 51, 0.55)",
  },
  dateModalCard: {
    borderRadius: 28,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.five,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.five,
  },
  monthArrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayRow: {
    flexDirection: "row",
    marginTop: Spacing.four,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.two,
  },
  calendarCell: {
    width: "14.2857%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarCellText: {
    width: "14.2857%",
    textAlign: "center",
  },
  todayButton: {
    alignItems: "center",
    paddingVertical: Spacing.four,
    marginTop: Spacing.three,
  },
  dateModalActions: {
    flexDirection: "row",
    gap: Spacing.four,
    marginTop: Spacing.three,
  },
  dateModalAction: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: Spacing.five,
  },
});
