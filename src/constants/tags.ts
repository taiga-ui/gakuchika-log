export type TagId =
  | "leadership"
  | "teamwork"
  | "analysis"
  | "presentation"
  | "recruiting"
  | "uiux"
  | "react"
  | "github"
  | "numbers"
  | "improvement";

export type TagMeta = {
  id: TagId;
  label: string;
  color: string;
  softColor: string;
};

export const TAGS = [
  {
    id: "leadership",
    label: "リーダーシップ",
    color: "#2563EB",
    softColor: "#E8F0FF",
  },
  { id: "teamwork", label: "チーム", color: "#0F9D58", softColor: "#E3F6EC" },
  { id: "analysis", label: "分析", color: "#7C3AED", softColor: "#EFE4FF" },
  { id: "presentation", label: "発表", color: "#D97706", softColor: "#FFF4DD" },
  { id: "recruiting", label: "就活", color: "#475569", softColor: "#EAEFF7" },
  { id: "uiux", label: "UI/UX", color: "#0EA5E9", softColor: "#E3F7FF" },
  { id: "react", label: "React", color: "#14B8A6", softColor: "#DEF9F5" },
  { id: "github", label: "GitHub", color: "#374151", softColor: "#ECEFF4" },
  { id: "numbers", label: "数字", color: "#F97316", softColor: "#FFF1E5" },
  { id: "improvement", label: "改善", color: "#EF4444", softColor: "#FDE8E8" },
] as const satisfies readonly TagMeta[];

export const TAG_MAP = Object.fromEntries(
  TAGS.map((tag) => [tag.id, tag]),
) as Record<TagId, TagMeta>;
