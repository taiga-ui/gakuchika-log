import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    background: "#F7F5F0",
    backgroundSecondary: "#FCFBF7",
    surface: "#FFFFFF",
    surfaceMuted: "#F3F6FC",
    surfaceElevated: "#FFFFFF",
    surfaceSelected: "#EAF2FF",
    border: "#E6E8EF",
    primary: "#2457D6",
    primarySoft: "#E8F0FF",
    accent: "#F4A340",
    success: "#2BA46A",
    warning: "#D97706",
    danger: "#E05252",
    text: "#162033",
    textSecondary: "#667085",
    textTertiary: "#98A2B3",
    textInverse: "#FFFFFF",
    shadow: "#B7C3DC",
  },
  dark: {
    background: "#09111E",
    backgroundSecondary: "#0E1626",
    surface: "#111B2B",
    surfaceMuted: "#172234",
    surfaceElevated: "#18253A",
    surfaceSelected: "#213251",
    border: "#253448",
    primary: "#7FA6FF",
    primarySoft: "#1B2E56",
    accent: "#F6C36C",
    success: "#47C68A",
    warning: "#F0A63B",
    danger: "#F17777",
    text: "#F3F6FB",
    textSecondary: "#B3C0D6",
    textTertiary: "#8391A8",
    textInverse: "#09111E",
    shadow: "#000000",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
} as const;

export const BottomTabInset = Platform.select({ ios: 24, android: 18 }) ?? 0;
export const MaxContentWidth = 1080;
