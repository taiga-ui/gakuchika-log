import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Screen } from "@/components/ui/screen";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

type ReflectionKey =
  | "activity"
  | "challenge"
  | "difficulty"
  | "action"
  | "role"
  | "result"
  | "learning";
const reflectionFields: Array<{
  key: ReflectionKey;
  label: string;
  placeholder: string;
}> = [
  {
    key: "activity",
    label: "活動：何をした？",
    placeholder: "活動の内容を具体的に書きましょう",
  },
  {
    key: "challenge",
    label: "課題：どんな課題があった？",
    placeholder: "当時の状況や課題を書きましょう",
  },
  {
    key: "difficulty",
    label: "困難：何に苦労した？",
    placeholder: "難しかったこと、乗り越えたことを書きましょう",
  },
  {
    key: "action",
    label: "工夫：どう考えて行動した？",
    placeholder: "考えたことと実際の工夫を書きましょう",
  },
  {
    key: "role",
    label: "自分の役割：チームの中で何をした？",
    placeholder: "自分が担った役割を書きましょう",
  },
  {
    key: "result",
    label: "結果・変化：何が変わった？",
    placeholder: "成果や周囲の変化を書きましょう",
  },
  {
    key: "learning",
    label: "学び：何を学んだ？",
    placeholder: "この経験から得た学びを書きましょう",
  },
];
export default function GakuchikaDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const record = useAppStore((state) =>
    state.gakuchikaRecords.find((item) => item.id === id),
  );
  const activities = useAppStore((state) => state.activities);
  const updateGakuchika = useAppStore((state) => state.updateGakuchika);
  const saveGakuchika = useAppStore((state) => state.saveGakuchika);
  const [reflection, setReflection] = useState(record?.reflection || {});
  const [company, setCompany] = useState(record?.es?.company || "");
  const [question, setQuestion] = useState(record?.es?.question || "");
  const [maxCharacters, setMaxCharacters] = useState(
    String(record?.es?.maxCharacters || 400),
  );
  const [content, setContent] = useState(record?.es?.content || "");

  if (!record)
    return (
      <Screen>
        <EmptyState
          icon="document-text-outline"
          title="ガクチカが見つかりません"
          description="一覧へ戻って別のカードを開いてください。"
          actionLabel="一覧へ戻る"
          onActionPress={() => router.back()}
        />
      </Screen>
    );

  const saveReflection = (key: ReflectionKey, value: string) => {
    const nextReflection = { ...reflection, [key]: value };
    setReflection(nextReflection);
    updateGakuchika(record.id, { reflection: nextReflection });
  };
  const saveEs = (patch: Partial<NonNullable<typeof record.es>>) => {
    const next = {
      company,
      question,
      maxCharacters: Number(maxCharacters) || 400,
      content,
      ...patch,
    };
    setCompany(next.company);
    setQuestion(next.question);
    setMaxCharacters(String(next.maxCharacters));
    setContent(next.content);
    updateGakuchika(record.id, { es: next });
  };
  const count = [...content].length;
  const handleSave = () => {
    updateGakuchika(record.id, {
      reflection,
      es: {
        company,
        question,
        maxCharacters: Number(maxCharacters) || 400,
        content,
      },
    });
    saveGakuchika(record.id);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
    >
      <Screen>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.headerTitle, { color: theme.primary }]}>
              Gakuchika Log
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              経験を深掘りして、自分の言葉にする
            </ThemedText>
          </View>
        </View>
        <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
          {record.title}
        </ThemedText>
        <View style={[styles.related, { backgroundColor: theme.surface }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            関連する活動記録（{record.relatedActivityIds.length}件）
          </ThemedText>
          {activities
            .filter((activity) =>
              record.relatedActivityIds.includes(activity.id),
            )
            .map((activity) => (
              <View key={activity.id} style={styles.relatedActivity}>
                <ThemedText
                  style={[styles.relatedActivityTitle, { color: theme.text }]}
                >
                  {activity.title}
                </ThemedText>
                <ThemedText style={{ color: theme.textSecondary }}>
                  {activity.body}
                </ThemedText>
              </View>
            ))}
        </View>

        <ThemedText style={[styles.sectionHeading, { color: theme.text }]}>
          この経験について整理する
        </ThemedText>
        <View style={styles.fields}>
          {reflectionFields.map((field) => (
            <View
              key={field.key}
              style={[styles.fieldCard, { backgroundColor: theme.surface }]}
            >
              <ThemedText style={[styles.label, { color: theme.text }]}>
                {field.label}
              </ThemedText>
              <TextInput
                multiline
                value={reflection[field.key] || ""}
                onChangeText={(value) =>
                  setReflection((current) => ({
                    ...current,
                    [field.key]: value,
                  }))
                }
                onBlur={() =>
                  saveReflection(field.key, reflection[field.key] || "")
                }
                placeholder={field.placeholder}
                placeholderTextColor={theme.textTertiary}
                style={[
                  styles.input,
                  { backgroundColor: theme.surfaceMuted, color: theme.text },
                ]}
              />
            </View>
          ))}
        </View>

        <ThemedText style={[styles.sectionHeading, { color: theme.text }]}>
          ESを書く
        </ThemedText>
        <View style={[styles.esCard, { backgroundColor: theme.surface }]}>
          <ThemedText style={[styles.helper, { color: theme.textSecondary }]}>
            整理した経験を見ながら、自分の文章を書きましょう。
          </ThemedText>
          <ThemedText style={[styles.label, { color: theme.text }]}>
            企業名（任意）
          </ThemedText>
          <TextInput
            value={company}
            onChangeText={setCompany}
            onBlur={() => saveEs({ company })}
            placeholder="例：株式会社○○"
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.singleInput,
              { color: theme.text, borderColor: Colors.light.border },
            ]}
          />
          <ThemedText style={[styles.label, { color: theme.text }]}>
            質問（任意）
          </ThemedText>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            onBlur={() => saveEs({ question })}
            placeholder="例：学生時代に最も打ち込んだこと"
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.singleInput,
              { color: theme.text, borderColor: Colors.light.border },
            ]}
          />
          <View style={styles.countRow}>
            <ThemedText style={[styles.label, { color: theme.text }]}>
              ES本文
            </ThemedText>
            <TextInput
              value={maxCharacters}
              onChangeText={setMaxCharacters}
              onBlur={() =>
                saveEs({ maxCharacters: Number(maxCharacters) || 400 })
              }
              keyboardType="number-pad"
              style={[
                styles.limitInput,
                { color: theme.text, borderColor: Colors.light.border },
              ]}
            />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {count} / {maxCharacters || 400}文字
            </ThemedText>
          </View>
          <TextInput
            multiline
            value={content}
            onChangeText={setContent}
            onBlur={() => saveEs({ content })}
            placeholder="整理した経験をもとに、ES本文を書いてみましょう。"
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.esInput,
              { color: theme.text, borderColor: Colors.light.border },
            ]}
          />
        </View>
        <Pressable
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons
            name={record.savedAt ? "checkmark-circle-outline" : "save-outline"}
            size={22}
            color="#FFFFFF"
          />
          <ThemedText style={styles.saveButtonText}>
            {record.savedAt ? "変更を保存" : "このガクチカを保存"}
          </ThemedText>
        </Pressable>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 32,
  },
  headerTitle: { fontSize: 23, fontWeight: "700" },
  title: { fontSize: 30, lineHeight: 40, fontWeight: "700" },
  related: {
    borderRadius: 16,
    padding: 18,
    gap: 8,
    marginTop: 22,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  relatedActivity: { gap: 4, paddingTop: 4 },
  relatedActivityTitle: { fontSize: 15, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  sectionHeading: {
    fontSize: 23,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 12,
  },
  fields: { gap: 12 },
  fieldCard: {
    borderRadius: 14,
    padding: 16,
    gap: 9,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  label: { fontSize: 15, fontWeight: "700" },
  input: {
    minHeight: 70,
    borderRadius: 9,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 15,
    lineHeight: 22,
  },
  esCard: {
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 30,
  },
  helper: { fontSize: 14, lineHeight: 21 },
  singleInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  countRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  limitInput: {
    borderWidth: 1,
    borderRadius: 7,
    padding: 8,
    width: 68,
    textAlign: "center",
  },
  esInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 180,
    textAlignVertical: "top",
    fontSize: 15,
    lineHeight: 23,
  },
  saveButton: {
    minHeight: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 30,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
});
