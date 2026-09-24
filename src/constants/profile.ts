export const GRADE_OPTIONS = [
  "大学1年生",
  "大学2年生",
  "大学3年生",
  "大学4年生",
  "大学5年生以上",
  "大学院生",
  "その他",
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

export type ProfileField = "name" | "school" | "faculty" | "grade" | "target";

export const PROFILE_FIELD_LABELS: Record<ProfileField, string> = {
  name: "表示名",
  school: "学校名",
  faculty: "学部・学科",
  grade: "学年",
  target: "志望業界",
};
