import { LOCAL_OWNER_ID } from "@/constants/owner";
import {
  addActivity,
  addProject,
  deleteActivity,
  deleteProject,
  saveEs,
  saveGakuchika,
  updateActivity,
  updateProject,
  type AppData,
} from "@/data/app-repository";
import type { ActivityRecord, GakuchikaRecord, Project } from "@/types/domain";

const makeProject = (
  id: string,
  category: Project["category"] = "research",
): Project => ({
  id,
  ownerId: LOCAL_OWNER_ID,
  name: `Project ${id}`,
  category,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const makeActivity = (
  id: string,
  projectId: string,
  ownerId = LOCAL_OWNER_ID,
): ActivityRecord => ({
  id,
  ownerId,
  projectId,
  title: `Activity ${id}`,
  body: "記録本文",
  categoryKey: "research",
  tagIds: [],
  date: "2026-01-01",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const makeGakuchika = (
  id: string,
  relatedActivityIds: string[],
  ownerId = LOCAL_OWNER_ID,
): GakuchikaRecord => ({
  id,
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
  relatedActivityIds,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const makeData = (overrides: Partial<AppData> = {}): AppData => ({
  activities: [],
  projects: [],
  categories: [],
  tags: [],
  gakuchikaRecords: [],
  ...overrides,
});

describe("app repository", () => {
  it("performs project and activity CRUD", () => {
    const projectResult = addProject("研究プロジェクト", "research", {
      description: "説明",
    });
    const withProject = makeData({ projects: [projectResult.project] });
    const activityResult = addActivity(withProject, {
      projectId: projectResult.project.id,
      title: "実験を記録",
      body: "本文",
      categoryKey: "stale-category",
      tagIds: [],
      date: "2026-02-01",
    });

    expect(activityResult.record.ownerId).toBe(LOCAL_OWNER_ID);
    expect(activityResult.record.categoryKey).toBe("research");
    const withActivity = {
      ...withProject,
      ...activityResult.changes,
    };
    const updated = {
      ...withActivity,
      ...updateActivity(withActivity, activityResult.record.id, {
        title: "更新した記録",
      }),
    };

    expect(updated.activities[0].title).toBe("更新した記録");
    expect(updated.projects).toContainEqual(projectResult.project);
  });

  it("removes a project's activities and their references", () => {
    const project = makeProject("project-1");
    const otherProject = makeProject("project-2", "club");
    const deletedActivity = makeActivity("activity-1", project.id);
    const keptActivity = makeActivity("activity-2", otherProject.id);
    const data = makeData({
      projects: [project, otherProject],
      activities: [deletedActivity, keptActivity],
      gakuchikaRecords: [
        makeGakuchika("gakuchika-1", [deletedActivity.id, keptActivity.id]),
        makeGakuchika("gakuchika-2", [deletedActivity.id], "another-user"),
      ],
    });

    const next = { ...data, ...deleteProject(data, project.id) };

    expect(next.projects).toEqual([otherProject]);
    expect(next.activities).toEqual([keptActivity]);
    expect(next.gakuchikaRecords[0].relatedActivityIds).toEqual([
      keptActivity.id,
    ]);
    expect(next.gakuchikaRecords[1].relatedActivityIds).toEqual([
      deletedActivity.id,
    ]);
  });

  it("removes a deleted activity ID from related records", () => {
    const activity = makeActivity("activity-1", "project-1");
    const data = makeData({
      activities: [activity],
      gakuchikaRecords: [
        makeGakuchika("gakuchika-1", [activity.id, "activity-2"]),
      ],
    });

    const next = { ...data, ...deleteActivity(data, activity.id) };

    expect(next.activities).toEqual([]);
    expect(next.gakuchikaRecords[0].relatedActivityIds).toEqual(["activity-2"]);
  });

  it("propagates a project category change to its activities", () => {
    const project = makeProject("project-1", "research");
    const linkedActivity = makeActivity("activity-1", project.id);
    const unrelatedActivity = makeActivity("activity-2", "project-2");
    const data = makeData({
      projects: [project],
      activities: [linkedActivity, unrelatedActivity],
    });

    const next = {
      ...data,
      ...updateProject(data, project.id, { category: "volunteer" }),
    };

    expect(next.activities[0].categoryKey).toBe("volunteer");
    expect(next.activities[1].categoryKey).toBe("research");
  });

  it("accepts ES content at the limit and rejects content over it", () => {
    const data = makeData({
      gakuchikaRecords: [makeGakuchika("gakuchika-1", [])],
    });
    const es = {
      company: "企業",
      question: "質問",
      maxCharacters: 4,
    };

    expect(
      saveEs(data, "gakuchika-1", { ...es, content: "😀😀😀😀" }),
    ).not.toBeNull();
    expect(
      saveEs(data, "gakuchika-1", { ...es, content: "😀😀😀😀😀" }),
    ).toBeNull();
  });

  it("marks only the owned gakuchika record as saved", () => {
    const draft = makeGakuchika("gakuchika-1", []);
    const other = makeGakuchika("gakuchika-2", []);
    const data = makeData({ gakuchikaRecords: [draft, other] });

    const next = { ...data, ...saveGakuchika(data, draft.id) };

    expect(next.gakuchikaRecords[0]).toEqual(
      expect.objectContaining({ id: draft.id, savedAt: expect.any(String) }),
    );
    expect(next.gakuchikaRecords[1]).toEqual(other);
  });
});
