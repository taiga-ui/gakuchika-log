import { LOCAL_OWNER_ID } from "@/constants/owner";
import { getAiResultSources, resolveAiSource } from "@/utils/ai-search";

describe("AI search source resolution", () => {
  const data = {
    activities: [
      {
        id: "activity-1",
        ownerId: LOCAL_OWNER_ID,
        title: "活動記録",
        body: "活動の概要",
      },
    ],
    projects: [
      {
        id: "project-1",
        ownerId: LOCAL_OWNER_ID,
        name: "プロジェクト",
        description: "プロジェクトの説明",
      },
    ],
    gakuchikaRecords: [
      {
        id: "gakuchika-1",
        ownerId: LOCAL_OWNER_ID,
        title: "ガクチカ",
        overview: "ガクチカの概要",
      },
    ],
  } as never;

  it("resolves existing activity, project, and gakuchika sources", () => {
    expect(resolveAiSource("activity-1", data)).toMatchObject({
      kind: "activity",
      title: "活動記録",
    });
    expect(resolveAiSource("project-1", data)).toMatchObject({
      kind: "project",
      title: "プロジェクト",
    });
    expect(resolveAiSource("gakuchika-1", data)).toMatchObject({
      kind: "gakuchika",
      title: "ガクチカ",
    });
  });

  it("keeps missing source IDs as non-navigable references", () => {
    expect(resolveAiSource("deleted-1", data)).toBeNull();
    expect(
      getAiResultSources(
        {
          id: "result-1",
          title: "検索結果",
          summary: "概要",
          sourceIds: ["activity-1", "deleted-1"],
        },
        data,
      ),
    ).toEqual([
      expect.objectContaining({ kind: "activity", id: "activity-1" }),
      { kind: "missing", id: "deleted-1" },
    ]);
  });
});
