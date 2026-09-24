import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FormField } from "@/components/ui/form-field";
import { Screen } from "@/components/ui/screen";
import {
  GRADE_OPTIONS,
  INDUSTRY_OPTIONS,
  PROFILE_FIELD_LABELS,
  type ProfileField,
} from "@/constants/profile";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

const isProfileField = (value: string): value is ProfileField =>
  ["name", "school", "faculty", "grade", "target"].includes(value);

export default function ProfileFieldEditScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { field: rawField } = useLocalSearchParams<{ field: string }>();
  const field = isProfileField(rawField) ? rawField : "name";
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const initialValue = profile[field];
  const [text, setText] = useState(
    typeof initialValue === "string" ? initialValue : "",
  );
  const [selectedGrade, setSelectedGrade] = useState(profile.grade);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    profile.target,
  );

  const handleSave = () => {
    if (field === "target") updateProfile({ target: selectedIndustries });
    else if (field === "grade") updateProfile({ grade: selectedGrade });
    else updateProfile({ [field]: text.trim() } as Partial<typeof profile>);
    router.back();
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((current) =>
      current.includes(industry)
        ? current.filter((item) => item !== industry)
        : [...current, industry],
    );
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.headerAction}>
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            戻る
          </ThemedText>
        </Pressable>
        <ThemedText type="subtitle" style={{ color: theme.text }}>
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
      ) : field === "target" ? (
        <View>
          <ThemedText
            type="small"
            style={[styles.helper, { color: theme.textSecondary }]}
          >
            複数選択できます
          </ThemedText>
          {INDUSTRY_OPTIONS.map((industry) => (
            <CheckRow
              key={industry}
              label={industry}
              selected={selectedIndustries.includes(industry)}
              onPress={() => toggleIndustry(industry)}
            />
          ))}
        </View>
      ) : (
        <FormField
          label={PROFILE_FIELD_LABELS[field]}
          value={text}
          onChangeText={setText}
          placeholder="未設定"
        />
      )}

      <Pressable
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
      >
        <ThemedText type="smallBold" style={{ color: "#FFFFFF" }}>
          保存
        </ThemedText>
      </Pressable>
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
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionRow, { borderBottomColor: Colors.light.border }]}
    >
      <Ionicons
        name={selected ? "checkbox" : "square-outline"}
        size={24}
        color={selected ? theme.primary : theme.textTertiary}
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
    flexDirection: "row",
    alignItems: "center",
    width: 86,
    gap: 4,
  },
  headerSpacer: { width: 86 },
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
