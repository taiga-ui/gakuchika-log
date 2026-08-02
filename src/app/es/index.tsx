import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { SectionHeader } from "@/components/ui/section-header";
import { TagChip } from "@/components/ui/tag-chip";
import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function EsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTwoPane = width >= 900;
  const gakuchikaRecords = useAppStore((state) => state.gakuchikaRecords);
  const esDrafts = useAppStore((state) => state.esDrafts);
  const addEsDraft = useAppStore((state) => state.addEsDraft);
  const updateEsDraft = useAppStore((state) => state.updateEsDraft);

  const draft = esDrafts[0];
  const [selectedGakuchikaId, setSelectedGakuchikaId] = useState(
    draft?.relatedGakuchikaId ?? gakuchikaRecords[0]?.id ?? "",
  );
  const [title, setTitle] = useState(draft?.title ?? "");
  const [content, setContent] = useState(draft?.content ?? "");

  useEffect(() => {
    if (!selectedGakuchikaId && gakuchikaRecords[0]) {
      setSelectedGakuchikaId(gakuchikaRecords[0].id);
    }
  }, [gakuchikaRecords, selectedGakuchikaId]);

  const selectedGakuchika = useMemo(
    () =>
      gakuchikaRecords.find((item) => item.id === selectedGakuchikaId) ??
      gakuchikaRecords[0],
    [gakuchikaRecords, selectedGakuchikaId],
  );

  const relatedActivities = useMemo(() => {
    if (!selectedGakuchika) {
      return [];
    }

    return selectedGakuchika.relatedActivityIds;
  }, [selectedGakuchika]);

  const handleSave = () => {
    if (draft) {
      updateEsDraft(draft.id, {
        title: title.trim() || draft.title,
        prompt: draft.prompt,
        content: content.trim() || draft.content,
        wordCount:
          content.trim().split(/\s+/).filter(Boolean).length || draft.wordCount,
        relatedGakuchikaId: selectedGakuchika?.id,
        relatedActivityIds: relatedActivities,
      });
    } else {
      addEsDraft({
        title: title.trim() || "ESドラフト",
        prompt: "ガクチカをESに転用する",
        content: content.trim() || "経験を自分の言葉で整理する。",
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
        relatedGakuchikaId: selectedGakuchika?.id,
        relatedActivityIds: relatedActivities,
      });
    }
  };

  const referencePanel = (
    <View style={[styles.panel, { backgroundColor: theme.surface }]}>
      <SectionHeader title="参考情報" subtitle="右側の入力欄に転記して使う" />
      <View style={styles.referenceList}>
        {gakuchikaRecords.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setSelectedGakuchikaId(item.id)}
            style={[
              styles.referenceCard,
              {
                backgroundColor:
                  selectedGakuchika?.id === item.id
                    ? theme.primarySoft
                    : theme.surfaceMuted,
                borderColor:
                  selectedGakuchika?.id === item.id
                    ? theme.primary
                    : Colors.light.border,
              },
            ]}
          >
            <ThemedText type="smallBold" style={{ color: theme.text }}>
              {item.title}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {item.overview}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      {selectedGakuchika ? (
        <View style={styles.referenceDetail}>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            {selectedGakuchika.title}
          </ThemedText>
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, lineHeight: 22 }}
          >
            {selectedGakuchika.challenge}
          </ThemedText>
          <View style={styles.referenceTags}>
            {selectedGakuchika.numbers.map((item) => (
              <TagChip key={item} label={item} tone={theme.primarySoft} />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );

  const editorPanel = (
    <View style={[styles.panel, { backgroundColor: theme.surface }]}>
      <View style={styles.editorHeader}>
        <View>
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            ES作成
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            AIを使わず、蓄積した経験から自分で書く
          </ThemedText>
        </View>
        <Pressable
          style={[styles.iconButton, { backgroundColor: theme.primarySoft }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={18} color={theme.primary} />
        </Pressable>
      </View>

      <View style={styles.editorMetaRow}>
        <View
          style={[styles.counterBox, { backgroundColor: theme.surfaceMuted }]}
        >
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            文字数
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.text }}>
            {content.length}
          </ThemedText>
        </View>
        <View
          style={[styles.counterBox, { backgroundColor: theme.surfaceMuted }]}
        >
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            参照数
          </ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.text }}>
            {relatedActivities.length}
          </ThemedText>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          タイトル
        </ThemedText>
        <View
          style={[
            styles.textShell,
            {
              backgroundColor: theme.surfaceMuted,
              borderColor: Colors.light.border,
            },
          ]}
        >
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="ESのタイトル"
            placeholderTextColor={theme.textTertiary}
            style={[styles.textInput, { color: theme.text }]}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={{ color: theme.text }}>
          本文
        </ThemedText>
        <View
          style={[
            styles.textShell,
            styles.textAreaShell,
            {
              backgroundColor: theme.surfaceMuted,
              borderColor: Colors.light.border,
            },
          ]}
        >
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="参考情報をもとに、自分の言葉で記述する"
            placeholderTextColor={theme.textTertiary}
            style={[styles.textInput, styles.textArea, { color: theme.text }]}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.saveRow}>
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <ThemedText type="smallBold" style={{ color: theme.textInverse }}>
            保存
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.surfaceMuted }]}
          onPress={() =>
            router.push(`/gakuchika/${selectedGakuchika?.id ?? ""}`)
          }
        >
          <ThemedText type="smallBold" style={{ color: theme.text }}>
            関連ガクチカを見る
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen>
      <View style={styles.pageTitleRow}>
        <SectionHeader
          title="ES作成"
          subtitle="左に参考情報、右に入力欄を置く"
        />
        <Pressable
          style={[styles.topButton, { backgroundColor: theme.surface }]}
          onPress={() => router.push("/gakuchika")}
        >
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            一覧へ
          </ThemedText>
        </Pressable>
      </View>

      <View style={[styles.workspace, { maxWidth: MaxContentWidth }]}>
        {isTwoPane ? (
          <View style={styles.twoPane}>
            <View style={styles.pane}>{referencePanel}</View>
            <View style={styles.pane}>{editorPanel}</View>
          </View>
        ) : (
          <View style={styles.stackPane}>
            {referencePanel}
            {editorPanel}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitleRow: {
    gap: 12,
    marginBottom: Spacing.three,
  },
  topButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  workspace: {
    width: "100%",
    alignSelf: "center",
    paddingBottom: Spacing.six,
  },
  twoPane: {
    flexDirection: "row",
    gap: Spacing.four,
  },
  pane: {
    flex: 1,
  },
  stackPane: {
    gap: Spacing.four,
  },
  panel: {
    borderRadius: 28,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: Spacing.four,
  },
  referenceList: {
    gap: 10,
  },
  referenceCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.four,
    gap: 8,
  },
  referenceDetail: {
    gap: 10,
  },
  referenceTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editorMetaRow: {
    flexDirection: "row",
    gap: 10,
  },
  counterBox: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing.four,
    gap: 4,
  },
  fieldGroup: {
    gap: 8,
  },
  textShell: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
  },
  textInput: {
    minHeight: 52,
    fontSize: 15,
    paddingVertical: 14,
  },
  textAreaShell: {
    paddingVertical: 6,
  },
  textArea: {
    minHeight: 180,
  },
  saveRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  saveButton: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
