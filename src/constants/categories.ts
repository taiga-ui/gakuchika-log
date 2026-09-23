import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type ActivityCategoryKey = string;

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
    color: "#1D4ED8",
    softColor: "#DBEAFE",
    borderColor: "#93C5FD",
    description: "論文、実験、ゼミ活動",
  },
  {
    key: "study",
    label: "学習",
    icon: "school-outline",
    color: "#15803D",
    softColor: "#DCFCE7",
    borderColor: "#86EFAC",
    description: "授業、資格、インプット",
  },
  {
    key: "club",
    label: "サークル",
    icon: "people-outline",
    color: "#0F766E",
    softColor: "#CCFBF1",
    borderColor: "#99F6E4",
    description: "イベント、役職、運営",
  },
  {
    key: "internship",
    label: "インターン",
    icon: "briefcase-outline",
    color: "#C2410C",
    softColor: "#FFEDD5",
    borderColor: "#FDBA74",
    description: "実務経験、選考、成果",
  },
  {
    key: "part-time",
    label: "アルバイト",
    icon: "cafe-outline",
    color: "#A16207",
    softColor: "#FEF3C7",
    borderColor: "#FCD34D",
    description: "接客、改善、工夫",
  },
  {
    key: "development",
    label: "開発",
    icon: "code-slash-outline",
    color: "#0369A1",
    softColor: "#E0F2FE",
    borderColor: "#7DD3FC",
    description: "アプリ、Web、GitHub",
  },
  {
    key: "volunteer",
    label: "ボランティア",
    icon: "heart-outline",
    color: "#B91C1C",
    softColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    description: "地域活動、支援、協力",
  },
  {
    key: "competition",
    label: "大会",
    icon: "trophy-outline",
    color: "#BE185D",
    softColor: "#FCE7F3",
    borderColor: "#F9A8D4",
    description: "発表、コンテスト、受賞",
  },
] as const satisfies readonly CategoryMeta[];

export const ALL_CATEGORY_KEY = "all" as const;

export const CATEGORY_MAP = Object.fromEntries(
  ACTIVITY_CATEGORIES.map((category) => [category.key, category]),
) as Record<string, CategoryMeta>;
