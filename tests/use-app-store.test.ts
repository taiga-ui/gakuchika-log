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

import { normalizeActivityReferences } from "@/store/use-app-store";
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
});
