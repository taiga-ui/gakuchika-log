import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import {
  ACTIVITY_OPTIONS,
  GRADE_OPTIONS,
  INDUSTRY_OPTIONS,
  JOB_OPTIONS,
  PROFILE_FIELD_LABELS,
  toggleProfileOption,
  type ProfileField,
} from "@/constants/profile";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore, waitForPersistence } from "@/store/use-app-store";

const isProfileField = (value: string): value is ProfileField =>
  ["grade", "desiredIndustries", "desiredJobs", "mainActivities"].includes(
    value,
  );

export default function ProfileFieldEditScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { field: rawField } = useLocalSearchParams<{ field: string }>();
  const field = isProfileField(rawField) ? rawField : "grade";
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const restoreData = useAppStore((state) => state.restoreData);
  const [otherText, setOtherText] = useState(
    field === "desiredIndustries"
      ? (profile.otherIndustry ?? "")
      : field === "desiredJobs"
        ? (profile.otherJob ?? "")
        : (profile.otherActivity ?? ""),
  );
  const [selectedGrade, setSelectedGrade] = useState(profile.grade);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    field === "desiredIndustries"
      ? profile.desiredIndustries
      : field === "desiredJobs"
        ? profile.desiredJobs
        : profile.mainActivities,
  );
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    const snapshot = useAppStore.getState();
    if (field === "grade") {
      updateProfile({ grade: selectedGrade });
    } else {
      const otherValue = otherText.trim();
      updateProfile({
        [field]: selectedOptions,
        ...(field === "desiredIndustries"
          ? { otherIndustry: otherValue }
          : field === "desiredJobs"
            ? { otherJob: otherValue }
            : { otherActivity: otherValue }),
      });
    }
    setIsSaving(true);
    setSaveError("");
    try {
      await waitForPersistence();
      router.back();
    } catch {
      restoreData(snapshot);
      setSaveError("保存に失敗しました。内容を確認して再試行してください。");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((current) =>
      toggleProfileOption(
        current,
        option,
        field === "mainActivities" ? 5 : undefined,
      ),
    );
  };

  const options =
    field === "desiredIndustries"
      ? INDUSTRY_OPTIONS
      : field === "desiredJobs"
        ? JOB_OPTIONS
        : ACTIVITY_OPTIONS;
  const isMultiSelect = field !== "grade";
  const hasOther = selectedOptions.includes("その他");

  return (
    <Screen keyboardAvoiding>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.headerAction}>
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
        </Pressable>
        <ThemedText
          type="smallBold"
          numberOfLines={2}
          style={[styles.headerTitle, { color: theme.text }]}
        >
          {PROFILE_FIELD_LABELS[field]}の編集
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {field === "grade" ? (
        <OptionList
          options={GRADE_OPTIONS}
          selected={selectedGrade}
          onSelect={setSelectedGrade}
        />
      ) : isMultiSelect ? (
        <View>
          <ThemedText
            type="small"
            style={[styles.helper, { color: theme.textSecondary }]}
          >
            {field === "mainActivities"
              ? "複数選択できます（最大5個）"
              : "複数選択できます"}
          </ThemedText>
          {options.map((option) => (
            <CheckRow
              key={option}
              label={option}
              selected={selectedOptions.includes(option)}
              disabled={
                field === "mainActivities" &&
                selectedOptions.length >= 5 &&
                !selectedOptions.includes(option)
              }
              onPress={() => toggleOption(option)}
            />
          ))}
          {hasOther ? (
            <FormField
              label="その他の内容"
              value={otherText}
              onChangeText={setOtherText}
              placeholder="必要に応じて入力"
            />
          ) : null}
        </View>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
      >
        <ThemedText type="smallBold" style={{ color: "#FFFFFF" }}>
          保存
        </ThemedText>
      </Pressable>
      {saveError ? (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {saveError}
        </ThemedText>
      ) : null}
    </Screen>
  );
}

function OptionList({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const theme = useTheme();
  return (
    <View>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={[styles.optionRow, { borderBottomColor: Colors.light.border }]}
        >
          <Ionicons
            name={selected === option ? "radio-button-on" : "radio-button-off"}
            size={24}
            color={selected === option ? theme.primary : theme.textTertiary}
          />
          <ThemedText type="default" style={{ color: theme.text }}>
            {option}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

function CheckRow({
  label,
  selected,
  disabled = false,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.optionRow, { borderBottomColor: Colors.light.border }]}
    >
      <Ionicons
        name={selected ? "checkbox" : "square-outline"}
        size={24}
        color={
          selected
            ? theme.primary
            : disabled
              ? theme.textTertiary
              : theme.textTertiary
        }
      />
      <ThemedText type="default" style={{ color: theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
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
    width: 38,
    alignItems: "flex-start",
  },
  headerSpacer: { width: 38 },
  headerTitle: {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    marginHorizontal: Spacing.two,
  },
  helper: { marginBottom: Spacing.two },
  optionRow: {
    minHeight: 58,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderBottomWidth: 1,
  },
  saveButton: {
    marginTop: Spacing.six,
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
