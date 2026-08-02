export type PhotoPresetKey = "none" | "artifact" | "screen" | "memo";

export type PhotoPreset = {
  key: PhotoPresetKey;
  label: string;
  description: string;
  source?: number;
};

export const PHOTO_PRESETS: PhotoPreset[] = [
  {
    key: "none",
    label: "写真なし",
    description: "カテゴリアイコンと色で表現",
  },
  {
    key: "artifact",
    label: "成果物",
    description: "資料、ポスター、制作物",
    source: require("../../assets/images/tutorial-web.png"),
  },
  {
    key: "screen",
    label: "画面キャプチャ",
    description: "GitHub、アプリ、Web画面",
    source: require("../../assets/images/react-logo.png"),
  },
  {
    key: "memo",
    label: "メモ・資料",
    description: "賞状、議事録、記録メモ",
    source: require("../../assets/images/expo-logo.png"),
  },
];
