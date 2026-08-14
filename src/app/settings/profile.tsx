import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

export default function ProfileEditScreen() {
  const router = useRouter();
  const theme = useTheme();
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  const [name, setName] = useState(profile.name);
  const [school, setSchool] = useState(profile.school);
  const [faculty, setFaculty] = useState(profile.faculty);
  const [grade, setGrade] = useState(profile.grade);
  const [target, setTarget] = useState(profile.target);

  const handleSave = () => {
    updateProfile({
      name: name.trim() || profile.name,
      school: school.trim() || profile.school,
      faculty: faculty.trim() || profile.faculty,
      grade: grade.trim() || profile.grade,
      target: target.trim() || profile.target,
    });

    router.back();
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable style={styles.headerAction} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            戻る
          </ThemedText>
        </Pressable>

        <ThemedText
          type="subtitle"
          style={[styles.headerTitle, { color: theme.text }]}
        >
          プロフィール編集
        </ThemedText>

        <Pressable style={styles.headerActionRight} onPress={handleSave}>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            保存
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.avatarSection}>
        <View style={[styles.avatarShell, { backgroundColor: theme.surface }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primarySoft }]}>
            <Ionicons name="person" size={56} color={theme.primary} />
          </View>
          <Pressable
            style={[styles.cameraButton, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="camera" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          写真を選択
        </ThemedText>
      </View>

      <ThemedText
        type="smallBold"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        基本情報
      </ThemedText>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <FormRow
          label="表示名"
          value={name}
          onChangeText={setName}
          themeText={theme.text}
        />
      </View>

      <ThemedText
        type="smallBold"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        学歴情報
      </ThemedText>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <FormRow
          label="学校名"
          value={school}
          onChangeText={setSchool}
          themeText={theme.text}
          withBorder
        />
        <FormRow
          label="学部・学科"
          value={faculty}
          onChangeText={setFaculty}
          themeText={theme.text}
          withBorder
        />
        <FormRow
          label="学年"
          value={grade}
          onChangeText={setGrade}
          themeText={theme.text}
          withBorder
        />
        <FormRow
          label="志望業界"
          value={target}
          onChangeText={setTarget}
          themeText={theme.text}
        />
      </View>
    </Screen>
  );
}

type FormRowProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  themeText: string;
  withBorder?: boolean;
};

function FormRow({
  label,
  value,
  onChangeText,
  themeText,
  withBorder,
}: FormRowProps) {
  return (
    <View style={[styles.formRow, withBorder && styles.formRowBorder]}>
      <ThemedText
        type="default"
        style={[styles.rowLabel, { color: themeText }]}
      >
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#A0A8BA"
        style={[styles.input, { color: themeText }]}
        textAlign="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 58,
    marginHorizontal: -Spacing.five,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.five,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 86,
  },
  headerActionRight: {
    width: 86,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing.six,
  },
  avatarShell: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  avatar: {
    width: 118,
    height: 118,
    borderRadius: 59,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
    marginBottom: Spacing.five,
  },
  formRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  formRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  rowLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 40,
    paddingVertical: 0,
  },
});
