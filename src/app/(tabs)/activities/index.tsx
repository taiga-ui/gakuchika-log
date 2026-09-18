import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Screen } from "@/components/ui/screen";
import {
  BottomTabInset,
  Colors,
  MaxContentWidth,
  Spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

const tabs = [
  { label: "一覧", value: "list" },
  { label: "カレンダー", value: "calendar" },
] as const;

type ActivityViewTab = (typeof tabs)[number]["value"];

export default function ActivitiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activities = useAppStore((state) => state.activities);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);

  const [activeTab, setActiveTab] = useState<ActivityViewTab>("list");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1));

  const selectedActivities = useMemo(
    () =>
      [...activities]
        .filter((activity) => {
          if (selectedCategory === "all") return true;
          return activity.categoryKey === selectedCategory;
        })
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    [activities, selectedCategory],
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const offset = firstDay.getDay();
    const totalDaysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    ).getDate();

    const highlightedDates = new Set([
      "2026-08-01",
      "2026-08-02",
      "2026-08-11",
      "2026-08-12",
      "2026-08-13",
      ...activities
        .filter((activity) => activity.photoAsset)
        .map((activity) => activity.date),
    ]);

    const cells: Array<{ date: Date; inMonth: boolean; hasActivity: boolean }> =
      [];

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        index - offset + 1,
      );
      const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      cells.push({
        date,
        inMonth: date.getMonth() === currentMonth.getMonth(),
        hasActivity: highlightedDates.has(isoDate),
      });
    }

    return cells.slice(
      0,
      totalDaysInMonth + offset + (7 - ((totalDaysInMonth + offset) % 7 || 7)),
    );
  }, [activities, currentMonth]);

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <View style={styles.topBar}>
              <View style={styles.brandWrap}>
                <View style={[styles.avatar, { backgroundColor: "#D8D4CF" }]}>
                  <ThemedText type="smallBold" style={{ color: "#4E4B46" }}>
                    田
                  </ThemedText>
                </View>
                <ThemedText
                  type="smallBold"
                  style={[styles.brandText, { color: theme.primary }]}
                >
                  ガクチカログ
                </ThemedText>
              </View>

              <Pressable
                style={[
                  styles.settingsButton,
                  { backgroundColor: theme.surface },
                ]}
                onPress={() => router.push("/settings" as never)}
              >
                <Ionicons
                  name="settings-outline"
                  size={28}
                  color={theme.primary}
                />
              </Pressable>
            </View>

            <ThemedText
              type="title"
              style={[styles.title, { color: theme.text }]}
            >
              活動
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: theme.textSecondary }]}
            >
              記録を振り返りましょう
            </ThemedText>

            <View
              style={[styles.segment, { backgroundColor: theme.surfaceMuted }]}
            >
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.value;

                return (
                  <Pressable
                    key={tab.value}
                    onPress={() => setActiveTab(tab.value)}
                    style={[
                      styles.segmentButton,
                      isSelected
                        ? {
                            backgroundColor: theme.surface,
                            borderColor: Colors.light.border,
                          }
                        : { backgroundColor: "transparent" },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      style={{
                        color: isSelected ? theme.text : theme.textSecondary,
                      }}
                    >
                      {tab.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            {activeTab === "list" ? (
              <>
                <View
                  style={[
                    styles.searchBox,
                    { backgroundColor: theme.surfaceMuted },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={22}
                    color={theme.textTertiary}
                  />
                  <ThemedText
                    type="default"
                    style={{ color: theme.textTertiary }}
                  >
                    {searchQuery || "活動を検索"}
                  </ThemedText>
                </View>

                <View style={styles.filterRow}>
                  {[
                    { label: "すべて", value: "all" },
                    { label: "サークル", value: "club" },
                    { label: "アルバイト", value: "part-time" },
                    { label: "学業", value: "study" },
                  ].map((item) => (
                    <Pressable
                      key={item.value}
                      onPress={() => setSelectedCategory(item.value)}
                      style={[
                        styles.filterChip,
                        item.value === selectedCategory
                          ? {
                              backgroundColor: theme.primary,
                              borderColor: theme.primary,
                            }
                          : {
                              backgroundColor: theme.surfaceMuted,
                              borderColor: Colors.light.border,
                            },
                      ]}
                    >
                      <ThemedText
                        type="smallBold"
                        style={[
                          styles.filterLabel,
                          {
                            color:
                              item.value === selectedCategory
                                ? "#FFFFFF"
                                : theme.textSecondary,
                          },
                        ]}
                      >
                        {item.label}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.list}>
                  {selectedActivities.map((activity, index) => {
                    const isFeatured = index === 0;

                    if (isFeatured) {
                      return (
                        <Pressable
                          key={activity.id}
                          onPress={() =>
                            router.push(`/activities/${activity.id}`)
                          }
                          style={[
                            styles.featureCard,
                            { backgroundColor: theme.surface },
                          ]}
                        >
                          {activity.photoAsset ? (
                            <Image
                              source={activity.photoAsset as number}
                              style={styles.featureImage}
                              contentFit="cover"
                            />
                          ) : (
                            <View style={styles.featureImage} />
                          )}

                          <View style={styles.featureContent}>
                            <View
                              style={[
                                styles.badge,
                                { backgroundColor: theme.surfaceMuted },
                              ]}
                            >
                              <ThemedText
                                type="small"
                                style={{ color: theme.textSecondary }}
                              >
                                サークル
                              </ThemedText>
                            </View>
                            <ThemedText
                              type="subtitle"
                              style={[
                                styles.featureTitle,
                                { color: theme.text },
                              ]}
                            >
                              {activity.title}
                            </ThemedText>
                          </View>

                          <ThemedText
                            type="default"
                            style={[
                              styles.featureBody,
                              { color: theme.textSecondary },
                            ]}
                          >
                            {activity.body.length > 120
                              ? `${activity.body.slice(0, 120)}...`
                              : activity.body}
                          </ThemedText>

                          <View style={styles.metaRow}>
                            <View style={styles.dateRow}>
                              <Ionicons
                                name="calendar-outline"
                                size={18}
                                color={theme.textTertiary}
                              />
                              <ThemedText
                                type="small"
                                style={{ color: theme.textSecondary }}
                              >
                                {activity.date.replace(/-/g, ".")}
                              </ThemedText>
                            </View>
                            <View style={styles.dateRow}>
                              <Ionicons
                                name="time-outline"
                                size={18}
                                color={theme.textTertiary}
                              />
                              <ThemedText
                                type="small"
                                style={{ color: theme.textSecondary }}
                              >
                                2.5h
                              </ThemedText>
                            </View>
                          </View>
                        </Pressable>
                      );
                    }

                    return (
                      <Pressable
                        key={activity.id}
                        onPress={() =>
                          router.push(`/activities/${activity.id}`)
                        }
                        style={[
                          styles.compactCard,
                          { backgroundColor: theme.surface },
                        ]}
                      >
                        <View style={styles.compactHeader}>
                          <View
                            style={[
                              styles.badge,
                              { backgroundColor: theme.surfaceMuted },
                            ]}
                          >
                            <ThemedText
                              type="small"
                              style={{ color: theme.textSecondary }}
                            >
                              {activity.categoryKey === "part-time"
                                ? "アルバイト"
                                : activity.categoryKey === "study"
                                  ? "学業"
                                  : "サークル"}
                            </ThemedText>
                          </View>
                          <Ionicons
                            name={
                              activity.categoryKey === "part-time"
                                ? "storefront-outline"
                                : activity.categoryKey === "study"
                                  ? "school-outline"
                                  : "people-outline"
                            }
                            size={24}
                            color={theme.textTertiary}
                          />
                        </View>

                        <ThemedText
                          type="subtitle"
                          style={[styles.compactTitle, { color: theme.text }]}
                        >
                          {activity.title}
                        </ThemedText>
                        <ThemedText
                          type="default"
                          style={[
                            styles.compactBody,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {activity.body.length > 110
                            ? `${activity.body.slice(0, 110)}...`
                            : activity.body}
                        </ThemedText>
                        <View style={styles.inlineMeta}>
                          <View style={styles.dateRow}>
                            <Ionicons
                              name="calendar-outline"
                              size={18}
                              color={theme.textTertiary}
                            />
                            <ThemedText
                              type="small"
                              style={{ color: theme.textSecondary }}
                            >
                              {activity.date.replace(/-/g, ".")}
                            </ThemedText>
                          </View>
                          {activity.categoryKey === "study" ? (
                            <View style={styles.inlineAuthor}>
                              <Ionicons
                                name="person-outline"
                                size={18}
                                color={theme.textTertiary}
                              />
                              <ThemedText
                                type="small"
                                style={{ color: theme.textSecondary }}
                              >
                                学びあり
                              </ThemedText>
                            </View>
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            ) : (
              <View
                style={[
                  styles.calendarCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <View style={styles.calendarHeader}>
                  <Pressable
                    onPress={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1,
                          1,
                        ),
                      )
                    }
                    hitSlop={12}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={28}
                      color={theme.text}
                    />
                  </Pressable>

                  <ThemedText
                    type="default"
                    style={[styles.monthText, { color: theme.text }]}
                  >
                    {`${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`}
                  </ThemedText>

                  <Pressable
                    onPress={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          1,
                        ),
                      )
                    }
                    hitSlop={12}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={28}
                      color={theme.text}
                    />
                  </Pressable>
                </View>

                <View style={styles.weekdayRow}>
                  {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                    <ThemedText
                      key={day}
                      type="smallBold"
                      style={[
                        styles.weekdayText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {day}
                    </ThemedText>
                  ))}
                </View>

                <View style={styles.grid}>
                  {calendarDays.map(({ date, inMonth, hasActivity }, index) => {
                    const isActive =
                      hasActivity &&
                      [1, 2, 11, 12, 13].includes(date.getDate());

                    return (
                      <View
                        key={`${date.toISOString()}-${index}`}
                        style={[
                          styles.dayCell,
                          {
                            backgroundColor: inMonth
                              ? hasActivity
                                ? isActive
                                  ? "#2B7DE9"
                                  : "#EAF2FF"
                                : "#E9EEF5"
                              : "#E9EEF5",
                          },
                        ]}
                      >
                        <ThemedText
                          type="default"
                          style={[
                            styles.dayText,
                            {
                              color:
                                inMonth && hasActivity
                                  ? "#FFFFFF"
                                  : inMonth
                                    ? theme.text
                                    : theme.textTertiary,
                            },
                          ]}
                        >
                          {date.getDate()}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <Pressable
          style={[styles.fab, { backgroundColor: "#0B7A57" }]}
          onPress={() => router.push("/activities/new")}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.eight,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.five,
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  brandText: {
    fontSize: 18,
    lineHeight: 26,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    lineHeight: 52,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: Spacing.four,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.four,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: Spacing.three,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
    marginBottom: Spacing.four,
  },
  filterChip: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  list: {
    gap: Spacing.three,
    paddingBottom: 150,
  },
  featureCard: {
    borderRadius: 22,
    padding: 0,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  featureImage: {
    height: 200,
    backgroundColor: "#d9e0df",
  },
  featureContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featureTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
  },
  featureBody: {
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 15,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compactCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compactTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
  },
  compactBody: {
    fontSize: 15,
    lineHeight: 24,
  },
  inlineMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 10,
  },
  inlineAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  calendarCard: {
    borderRadius: 22,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  monthText: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
  },
  dayCell: {
    width: "13.2%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  dayText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 10,
    bottom: 4 + BottomTabInset,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
