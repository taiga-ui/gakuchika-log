import { ACTIVITY_CATEGORIES, type CategoryMeta } from "@/constants/categories";
import { TAGS, type TagId, type TagMeta } from "@/constants/tags";
import type {
  ActivityRecord,
  EsData,
  GakuchikaRecord,
  Project,
} from "@/types/domain";
import { toIsoDate } from "@/utils/date";

export type ActivityDraft = Omit<
  ActivityRecord,
  "id" | "ownerId" | "createdAt" | "updatedAt"
>;
export type EsDraft = Omit<EsData, "ownerId">;
export type ProjectDetails = Pick<Project, "description">;

export type AppData = {
  activities: ActivityRecord[];
  projects: Project[];
  categories: CategoryMeta[];
  tags: TagMeta[];
  gakuchikaRecords: GakuchikaRecord[];
};

export type AppRepository = {
  addActivity: (
    data: AppData,
    draft: ActivityDraft,
  ) => {
    record: ActivityRecord;
    changes: Partial<AppData>;
  };
  updateActivity: (
    data: AppData,
    id: string,
    patch: Partial<ActivityRecord>,
  ) => Partial<AppData>;
  deleteActivity: (data: AppData, id: string) => Partial<AppData>;
  addProject: (
    name: string,
    category: Project["category"],
    details?: ProjectDetails,
  ) => { project: Project; changes: Partial<AppData> };
  updateProject: (
    data: AppData,
    id: string,
    patch: Partial<Pick<Project, "name" | "description" | "category">>,
  ) => Partial<AppData>;
  deleteProject: (data: AppData, id: string) => Partial<AppData>;
  addGakuchika: (
    data: AppData,
    activityIds: string[],
    title?: string,
  ) => { record: GakuchikaRecord; changes: Partial<AppData> };
  updateGakuchika: (
    data: AppData,
    id: string,
    patch: Partial<Omit<GakuchikaRecord, "id">>,
  ) => Partial<AppData> | null;
  saveGakuchika: (data: AppData, id: string) => Partial<AppData>;
  saveEs: (data: AppData, id: string, es: EsDraft) => Partial<AppData> | null;
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const isValidEs = (es: Pick<EsData, "maxCharacters" | "content">) =>
  Number.isInteger(es.maxCharacters) &&
  es.maxCharacters > 0 &&
  [...es.content].length <= es.maxCharacters;

export const createAppRepository = (ownerId: string): AppRepository => ({
  addActivity: (data, draft) => {
    const now = new Date();
    const project = data.projects.find((item) => item.id === draft.projectId);
    const record: ActivityRecord = {
      ...draft,
      ownerId,
      id: createId("activity"),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      date: draft.date || toIsoDate(now),
      ...(project ? { categoryKey: project.category } : {}),
    };
    return { record, changes: { activities: [record, ...data.activities] } };
  },
  updateActivity: (data, id, patch) => {
    const current = data.activities.find(
      (activity) => activity.id === id && activity.ownerId === ownerId,
    );
    const project = data.projects.find(
      (item) =>
        item.id === (patch.projectId ?? current?.projectId) &&
        item.ownerId === ownerId,
    );
    return {
      activities: data.activities.map((activity) =>
        activity.id === id && activity.ownerId === ownerId
          ? {
              ...activity,
              ...patch,
              ownerId,
              ...(project ? { categoryKey: project.category } : {}),
              updatedAt: new Date().toISOString(),
            }
          : activity,
      ),
    };
  },
  deleteActivity: (data, id) => ({
    activities: data.activities.filter(
      (activity) => !(activity.id === id && activity.ownerId === ownerId),
    ),
    gakuchikaRecords: data.gakuchikaRecords.map((record) =>
      record.ownerId === ownerId
        ? {
            ...record,
            relatedActivityIds: record.relatedActivityIds.filter(
              (activityId) => activityId !== id,
            ),
            ...(record.relatedActivityIds.includes(id)
              ? { updatedAt: new Date().toISOString() }
              : {}),
          }
        : record,
    ),
  }),
  addProject: (name, category, details) => {
    const now = new Date().toISOString();
    const project: Project = {
      id: createId("project"),
      ownerId,
      name,
      category,
      ...details,
      createdAt: now,
      updatedAt: now,
    };
    return { project, changes: { projects: [project] } };
  },
  updateProject: (data, id, patch) => {
    const now = new Date().toISOString();
    const projects = data.projects.map((project) =>
      project.id === id && project.ownerId === ownerId
        ? { ...project, ...patch, updatedAt: now }
        : project,
    );
    const nextProject = projects.find(
      (project) => project.id === id && project.ownerId === ownerId,
    );
    return {
      projects,
      ...(nextProject
        ? {
            activities: data.activities.map((activity) =>
              activity.projectId === id && activity.ownerId === ownerId
                ? {
                    ...activity,
                    categoryKey: nextProject.category,
                    updatedAt: now,
                  }
                : activity,
            ),
          }
        : {}),
    };
  },
  deleteProject: (data, id) => {
    const deletedActivityIds = new Set(
      data.activities
        .filter(
          (activity) =>
            activity.projectId === id && activity.ownerId === ownerId,
        )
        .map((activity) => activity.id),
    );
    return {
      projects: data.projects.filter(
        (project) => !(project.id === id && project.ownerId === ownerId),
      ),
      activities: data.activities.filter(
        (activity) =>
          !(activity.projectId === id && activity.ownerId === ownerId),
      ),
      gakuchikaRecords: data.gakuchikaRecords.map((record) =>
        record.ownerId === ownerId
          ? {
              ...record,
              relatedActivityIds: record.relatedActivityIds.filter(
                (activityId) => !deletedActivityIds.has(activityId),
              ),
              ...(record.relatedActivityIds.some((activityId) =>
                deletedActivityIds.has(activityId),
              )
                ? { updatedAt: new Date().toISOString() }
                : {}),
            }
          : record,
      ),
    };
  },
  addGakuchika: (data, activityIds, title) => {
    const now = new Date().toISOString();
    const record: GakuchikaRecord = {
      id: createId("gakuchika"),
      ownerId,
      title: title?.trim() || "無題のガクチカ",
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
      relatedActivityIds: activityIds.filter((activityId) =>
        data.activities.some(
          (activity) =>
            activity.id === activityId && activity.ownerId === ownerId,
        ),
      ),
      createdAt: now,
      updatedAt: now,
    };
    return {
      record,
      changes: { gakuchikaRecords: [record, ...data.gakuchikaRecords] },
    };
  },
  updateGakuchika: (data, id, patch) => {
    if (patch.es && !isValidEs(patch.es)) return null;
    return {
      gakuchikaRecords: data.gakuchikaRecords.map((record) =>
        record.id === id && record.ownerId === ownerId
          ? {
              ...record,
              ...patch,
              ownerId,
              ...(patch.relatedActivityIds
                ? {
                    relatedActivityIds: patch.relatedActivityIds.filter(
                      (activityId) =>
                        data.activities.some(
                          (activity) =>
                            activity.id === activityId &&
                            activity.ownerId === record.ownerId,
                        ),
                    ),
                  }
                : {}),
              updatedAt: new Date().toISOString(),
            }
          : record,
      ),
    };
  },
  saveGakuchika: (data, id) => {
    const now = new Date().toISOString();
    return {
      gakuchikaRecords: data.gakuchikaRecords.map((record) =>
        record.id === id && record.ownerId === ownerId
          ? { ...record, ownerId, savedAt: now, updatedAt: now }
          : record,
      ),
    };
  },
  saveEs: (data, id, es) => {
    if (!isValidEs(es)) return null;
    return {
      gakuchikaRecords: data.gakuchikaRecords.map((record) =>
        record.id === id && record.ownerId === ownerId
          ? {
              ...record,
              es: { ...es, ownerId },
              updatedAt: new Date().toISOString(),
            }
          : record,
      ),
    };
  },
});

export const addCategory = (
  label: string,
  existingCategories: readonly CategoryMeta[] = [],
): CategoryMeta => {
  const usage = new Map<string, number>(
    ACTIVITY_CATEGORIES.map((category) => [category.color, 0]),
  );
  existingCategories.forEach((category) => {
    const count = usage.get(category.color);
    if (count !== undefined) usage.set(category.color, count + 1);
  });
  const paletteCategory = ACTIVITY_CATEGORIES.reduce((leastUsed, category) =>
    usage.get(category.color)! < usage.get(leastUsed.color)!
      ? category
      : leastUsed,
  );

  return {
    key: createId("category"),
    label,
    icon: "folder-outline",
    color: paletteCategory.color,
    softColor: paletteCategory.softColor,
    borderColor: paletteCategory.borderColor,
    description: "ユーザーが追加したカテゴリ",
  };
};

export const addTag = (
  label: string,
  existingTags: readonly TagMeta[] = [],
): TagMeta => {
  const usage = new Map<string, number>(TAGS.map((tag) => [tag.color, 0]));
  existingTags.forEach((tag) => {
    const count = usage.get(tag.color);
    if (count !== undefined) usage.set(tag.color, count + 1);
  });
  const paletteTag = TAGS.reduce((leastUsed, tag) =>
    usage.get(tag.color)! < usage.get(leastUsed.color)! ? tag : leastUsed,
  );

  return {
    id: createId("tag") as TagId,
    label,
    color: paletteTag.color,
    softColor: paletteTag.softColor,
  };
};

export const mergeCategories = (persistedCategories?: CategoryMeta[]) => {
  const savedCategories = persistedCategories ?? [];
  const builtInKeys = new Set<string>(
    ACTIVITY_CATEGORIES.map((category) => category.key),
  );
  const customCategories = savedCategories.filter(
    (category) => !builtInKeys.has(category.key),
  );
  return [...ACTIVITY_CATEGORIES, ...customCategories];
};
