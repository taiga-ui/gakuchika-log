const mockStorage = new Map<string, string>();

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn((key: string) =>
    Promise.resolve(mockStorage.get(key) ?? null),
  ),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    mockStorage.delete(key);
    return Promise.resolve();
  }),
}));

import { toggleProfileOption } from "@/constants/profile";
import {
  normalizeActivityReferences,
  normalizeProfile,
} from "@/store/use-app-store";
import type { ActivityRecord, GakuchikaRecord, Project } from "@/types/domain";

const makeActivity = (id: string, ownerId: string): ActivityRecord => ({
  id,
  ownerId,
  projectId: "project-1",
  title: id,
  body: "本文",
  categoryKey: "research",
  tagIds: [],
  date: "2026-01-01",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const makeProject = (ownerId: string): Project => ({
  id: "project-1",
  ownerId,
  name: "プロジェクト",
  category: "research",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const makeGakuchika = (ownerId: string): GakuchikaRecord => ({
  id: "gakuchika-1",
  ownerId,
  title: "ガクチカ",
  overview: "",
  period: "",
  role: "",
  challenge: "",
  difficulty: "",
  action: "",
  result: "",
  learning: "",
  numbers: [],
  artifact: "",
  relatedActivityIds: ["activity-local", "activity-foreign"],
  es: {
    ownerId,
    company: "企業",
    question: "質問",
    maxCharacters: 10,
    content: "回答",
  },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("app store hydration", () => {
  it("preserves persisted owners and removes cross-owner references", () => {
    const result = normalizeActivityReferences(
      [
        makeActivity("activity-local", "another-user"),
        makeActivity("activity-foreign", "different-user"),
      ],
      [makeProject("another-user")],
      [makeGakuchika("another-user")],
    );

    expect(result.projects[0].ownerId).toBe("another-user");
    expect(result.activities[0].ownerId).toBe("another-user");
    expect(result.gakuchikaRecords[0].ownerId).toBe("another-user");
    expect(result.gakuchikaRecords[0].es?.ownerId).toBe("another-user");
    expect(result.gakuchikaRecords[0].relatedActivityIds).toEqual([
      "activity-local",
    ]);
  });

  it("normalizes old profile data without retaining personal fields", () => {
    expect(
      normalizeProfile({
        name: "旧ユーザー",
        school: "旧大学",
        faculty: "旧学部",
        grade: "大学2年生",
        target: "メーカー",
      }),
    ).toEqual({
      grade: "大学2年生",
      desiredIndustries: ["メーカー"],
      desiredJobs: [],
      mainActivities: [],
    });
  });

  it("limits main activity selections to five", () => {
    const selected = [
      "サークル",
      "アルバイト",
      "学業・研究",
      "インターン",
      "資格・試験",
    ];
    expect(toggleProfileOption(selected, "学生団体", 5)).toEqual(selected);
    expect(toggleProfileOption(selected, "資格・試験", 5)).toEqual([
      "サークル",
      "アルバイト",
      "学業・研究",
      "インターン",
    ]);
  });

  it("restores multi-select and custom profile values", () => {
    expect(
      normalizeProfile({
        grade: "大学3年生",
        desiredIndustries: ["IT・Web・ソフトウェア", "メーカー"],
        desiredJobs: ["エンジニア", "その他"],
        mainActivities: [
          "個人開発",
          "その他",
          "サークル",
          "アルバイト",
          "資格・試験",
          "学生団体",
        ],
        otherJob: "プロダクトマネージャー",
        otherActivity: "地域活動",
      }),
    ).toEqual({
      grade: "大学3年生",
      desiredIndustries: ["IT・Web・ソフトウェア", "メーカー"],
      desiredJobs: ["エンジニア", "その他"],
      mainActivities: [
        "個人開発",
        "その他",
        "サークル",
        "アルバイト",
        "資格・試験",
      ],
      otherJob: "プロダクトマネージャー",
      otherActivity: "地域活動",
    });
  });
});
