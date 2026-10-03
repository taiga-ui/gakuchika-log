import { ACTIVITY_CATEGORIES } from "@/constants/categories";
import { LOCAL_OWNER_ID } from "@/constants/owner";
import { TAGS } from "@/constants/tags";
import {
  addCategory,
  addTag,
  createAppRepository,
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
  const repository = createAppRepository(LOCAL_OWNER_ID);

  it("performs project and activity CRUD", () => {
    const projectResult = repository.addProject(
      "研究プロジェクト",
      "research",
      {
        description: "説明",
      },
    );
    const withProject = makeData({ projects: [projectResult.project] });
    const activityResult = repository.addActivity(withProject, {
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
      ...repository.updateActivity(withActivity, activityResult.record.id, {
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

    const next = { ...data, ...repository.deleteProject(data, project.id) };

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

    const next = { ...data, ...repository.deleteActivity(data, activity.id) };

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
      ...repository.updateProject(data, project.id, { category: "volunteer" }),
    };

    expect(next.activities[0].categoryKey).toBe("volunteer");
    expect(next.activities[1].categoryKey).toBe("research");
  });

  it("updates and deletes categories without changing projects or activities", () => {
    const category = { ...ACTIVITY_CATEGORIES[0], key: "custom-category" };
    const project = makeProject("project-1", category.key);
    const activity = {
      ...makeActivity("activity-1", project.id),
      categoryKey: category.key,
    };
    const data = makeData({
      categories: [category],
      projects: [project],
      activities: [activity],
    });

    const renamed = {
      ...data,
      ...repository.updateCategory(data, category.key, "新カテゴリ"),
    };
    expect(renamed.categories[0]).toEqual(
      expect.objectContaining({ key: category.key, label: "新カテゴリ" }),
    );

    const deleted = {
      ...renamed,
      ...repository.deleteCategory(renamed, category.key),
    };
    expect(deleted.categories).toEqual([]);
    expect(deleted.projects).toEqual([project]);
    expect(deleted.activities).toEqual([activity]);
  });

  it("updates tag labels and removes only that tag from activities", () => {
    const data = makeData({
      tags: [{ ...TAGS[0] }, { ...TAGS[1] }],
      activities: [
        {
          ...makeActivity("activity-1", "project-1"),
          tagIds: [TAGS[0].id, TAGS[1].id],
        },
      ],
    });

    const renamed = {
      ...data,
      ...repository.updateTag(data, TAGS[0].id, "新タグ"),
    };
    expect(renamed.tags[0]).toEqual(
      expect.objectContaining({ id: TAGS[0].id, label: "新タグ" }),
    );

    const deleted = {
      ...renamed,
      ...repository.deleteTag(renamed, TAGS[0].id),
    };
    expect(deleted.tags).toEqual([{ ...TAGS[1] }]);
    expect(deleted.activities[0].tagIds).toEqual([TAGS[1].id]);
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
      repository.saveEs(data, "gakuchika-1", { ...es, content: "😀😀😀😀" }),
    ).not.toBeNull();
    expect(
      repository.saveEs(data, "gakuchika-1", { ...es, content: "😀😀😀😀😀" }),
    ).toBeNull();
  });

  it("marks only the owned gakuchika record as saved", () => {
    const draft = makeGakuchika("gakuchika-1", []);
    const other = makeGakuchika("gakuchika-2", []);
    const data = makeData({ gakuchikaRecords: [draft, other] });

    const next = { ...data, ...repository.saveGakuchika(data, draft.id) };

    expect(next.gakuchikaRecords[0]).toEqual(
      expect.objectContaining({ id: draft.id, savedAt: expect.any(String) }),
    );
    expect(next.gakuchikaRecords[1]).toEqual(other);
  });

  it("only relates activities owned by the gakuchika owner", () => {
    const ownedActivity = makeActivity("activity-1", "project-1");
    const otherActivity = makeActivity(
      "activity-2",
      "project-1",
      "another-user",
    );
    const draft = makeGakuchika("gakuchika-1", []);
    const data = makeData({
      activities: [ownedActivity, otherActivity],
      gakuchikaRecords: [draft],
    });

    const next = {
      ...data,
      ...repository.updateGakuchika(data, draft.id, {
        relatedActivityIds: [ownedActivity.id, otherActivity.id],
      }),
    };

    expect(next.gakuchikaRecords[0].relatedActivityIds).toEqual([
      ownedActivity.id,
    ]);
  });

  it("uses the ownerId supplied when creating the repository", () => {
    const otherRepository = createAppRepository("another-user");
    const result = otherRepository.addProject("別ユーザー", "research");

    expect(result.project.ownerId).toBe("another-user");
  });

  it("assigns the least-used palette color to new categories", () => {
    const existingCategories = [
      ...ACTIVITY_CATEGORIES,
      { ...ACTIVITY_CATEGORIES[0], key: "custom-blue" },
    ];

    expect(addCategory("学外活動", existingCategories)).toEqual(
      expect.objectContaining({
        color: ACTIVITY_CATEGORIES[1].color,
        softColor: ACTIVITY_CATEGORIES[1].softColor,
        borderColor: ACTIVITY_CATEGORIES[1].borderColor,
      }),
    );
  });

  it("reuses category palette colors when all colors are already used", () => {
    const existingCategories = ACTIVITY_CATEGORIES.map((category) => ({
      ...category,
      key: `existing-${category.key}`,
    }));

    expect(addCategory("追加カテゴリ", existingCategories).color).toBe(
      ACTIVITY_CATEGORIES[0].color,
    );
  });

  it("assigns the least-used palette color to new tags", () => {
    const existingTags = [
      ...TAGS.map((tag) => ({ ...tag, id: `existing-${tag.id}` })),
      { ...TAGS[0], id: "custom-blue" },
    ];

    expect(addTag("新しいタグ", existingTags)).toEqual(
      expect.objectContaining({
        color: TAGS[1].color,
        softColor: TAGS[1].softColor,
      }),
    );
  });

  it("reuses palette colors when all palette colors are already used", () => {
    const existingTags = TAGS.map((tag) => ({
      ...tag,
      id: `existing-${tag.id}`,
    }));

    expect(addTag("追加タグ", existingTags).color).toBe(TAGS[0].color);
  });
});
