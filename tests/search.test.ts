import { LOCAL_OWNER_ID } from "@/constants/owner";
import { searchRecords } from "@/utils/search";

describe("search records", () => {
  const data = {
    projects: [
      {
        id: "project-1",
        ownerId: LOCAL_OWNER_ID,
        name: "地域イベント",
        description: "運営プロジェクト",
        category: "volunteer" as const,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ],
    activities: [
      {
        id: "activity-1",
        ownerId: LOCAL_OWNER_ID,
        projectId: "project-1",
        title: "来場者導線を改善",
        body: "運営の案内表示を見直した",
        categoryKey: "volunteer" as const,
        tagIds: ["leadership"],
        date: "2026-01-02",
        createdAt: "2026-01-02",
        updatedAt: "2026-01-02",
      },
    ],
    gakuchikaRecords: [
      {
        id: "gakuchika-1",
        ownerId: LOCAL_OWNER_ID,
        title: "運営で学んだこと",
        overview: "調整力を発揮した経験",
        period: "大学祭",
        role: "リーダー",
        challenge: "",
        difficulty: "",
        action: "",
        result: "",
        learning: "",
        numbers: [],
        artifact: "",
        relatedActivityIds: ["activity-1"],
        es: {
          ownerId: LOCAL_OWNER_ID,
          company: "株式会社サンプル",
          question: "志望動機",
          content: "運営経験を活かしたい",
          maxCharacters: 400,
        },
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ],
    tags: [
      {
        id: "leadership",
        label: "リーダーシップ",
        color: "#000000",
        softColor: "#FFFFFF",
      },
    ],
  };

  it("returns each result kind with its detail route", () => {
    const results = searchRecords("運営", data);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "activity-1",
          kind: "activity",
          route: "/activities/activity-1",
        }),
        expect.objectContaining({
          id: "project-1",
          kind: "project",
          route: "/projects/project-1",
        }),
        expect.objectContaining({
          id: "gakuchika-1",
          kind: "gakuchika",
          route: "/gakuchika/gakuchika-1",
        }),
      ]),
    );

    const esResult = searchRecords("株式会社", data);
    expect(esResult).toEqual([
      expect.objectContaining({
        id: "gakuchika-1",
        kind: "es",
        route: "/gakuchika/gakuchika-1",
      }),
    ]);
  });

  it("returns no results for an unknown or empty query", () => {
    expect(searchRecords("存在しないキーワード", data)).toEqual([]);
    expect(searchRecords("   ", data)).toEqual([]);
  });

  it("does not return records owned by another user", () => {
    expect(
      searchRecords("秘密", {
        ...data,
        projects: [
          {
            ...data.projects[0],
            ownerId: "another-user",
            name: "秘密のプロジェクト",
          },
        ],
      }),
    ).toEqual([]);
  });
});
