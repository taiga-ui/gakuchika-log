export const GRADE_OPTIONS = [
  "大学1年生",
  "大学2年生",
  "大学3年生",
  "大学4年生",
  "大学5年生以上",
  "大学院生",
] as const;

export const INDUSTRY_OPTIONS = [
  "IT・Web・ソフトウェア",
  "通信",
  "メーカー",
  "商社",
  "金融・保険",
  "コンサルティング",
  "広告・マスコミ・出版",
  "人材・教育",
  "不動産・建設",
  "物流・運輸",
  "小売・流通",
  "食品・飲料",
  "医療・製薬・ヘルスケア",
  "エネルギー・インフラ",
  "官公庁・公社・団体",
  "その他",
] as const;

export const JOB_OPTIONS = [
  "エンジニア",
  "デザイナー",
  "企画",
  "営業",
  "マーケティング",
  "コンサルタント",
  "研究・開発",
  "その他",
] as const;

export const ACTIVITY_OPTIONS = [
  "サークル",
  "アルバイト",
  "学業・研究",
  "インターン",
  "資格・試験",
  "学生団体",
  "大学祭・イベント運営",
  "ボランティア",
  "個人開発",
  "その他",
] as const;

export type ProfileField =
  | "grade"
  | "desiredIndustries"
  | "desiredJobs"
  | "mainActivities";

export const PROFILE_FIELD_LABELS: Record<ProfileField, string> = {
  grade: "学年",
  desiredIndustries: "志望業界",
  desiredJobs: "興味のある職種",
  mainActivities: "主な活動",
};

export const toggleProfileOption = (
  selected: string[],
  option: string,
  maxSelections?: number,
) => {
  if (selected.includes(option)) {
    return selected.filter((item) => item !== option);
  }
  if (maxSelections !== undefined && selected.length >= maxSelections) {
    return selected;
  }
  return [...selected, option];
};
