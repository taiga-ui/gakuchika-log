import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type ActivityCategoryKey =
  | "research"
  | "study"
  | "club"
  | "internship"
  | "part-time"
  | "development"
  | "volunteer"
  | "competition";

export type CategoryMeta = {
  key: ActivityCategoryKey;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  softColor: string;
  borderColor: string;
  description: string;
};

export const ACTIVITY_CATEGORIES = [
  {
    key: "research",
    label: "研究",
    icon: "flask-outline",
    color: "#2563EB",
    softColor: "#E8F0FF",
    borderColor: "#C8DAFF",
    description: "論文、実験、ゼミ活動",
  },
  {
    key: "study",
    label: "学習",
    icon: "school-outline",
    color: "#0F9D58",
    softColor: "#E3F6EC",
    borderColor: "#BEEBD2",
    description: "授業、資格、インプット",
  },
  {
    key: "club",
    label: "サークル",
    icon: "people-outline",
    color: "#8B5CF6",
    softColor: "#EEE6FF",
    borderColor: "#D9CBFF",
    description: "イベント、役職、運営",
  },
  {
    key: "internship",
    label: "インターン",
    icon: "briefcase-outline",
    color: "#F97316",
    softColor: "#FFF1E5",
    borderColor: "#FFD5B4",
    description: "実務経験、選考、成果",
  },
  {
    key: "part-time",
    label: "アルバイト",
    icon: "cafe-outline",
    color: "#D97706",
    softColor: "#FFF4DD",
    borderColor: "#F9D99C",
    description: "接客、改善、工夫",
  },
  {
    key: "development",
    label: "開発",
    icon: "code-slash-outline",
    color: "#0EA5E9",
    softColor: "#E3F7FF",
    borderColor: "#BDEAFF",
    description: "アプリ、Web、GitHub",
  },
  {
    key: "volunteer",
    label: "ボランティア",
    icon: "heart-outline",
    color: "#EF4444",
    softColor: "#FDE8E8",
    borderColor: "#F8CACA",
    description: "地域活動、支援、協力",
  },
  {
    key: "competition",
    label: "大会",
    icon: "trophy-outline",
    color: "#7C3AED",
    softColor: "#EFE4FF",
    borderColor: "#D7C0FF",
    description: "発表、コンテスト、受賞",
  },
] as const satisfies readonly CategoryMeta[];

export const ALL_CATEGORY_KEY = "all" as const;

export const CATEGORY_MAP = Object.fromEntries(
  ACTIVITY_CATEGORIES.map((category) => [category.key, category]),
) as Record<ActivityCategoryKey, CategoryMeta>;
