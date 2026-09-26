import { ACTIVITY_CATEGORIES, type CategoryMeta } from "@/constants/categories";
import type { TagId, TagMeta } from "@/constants/tags";
import type {
  ActivityRecord,
  EsData,
  GakuchikaRecord,
  Project,
} from "@/types/domain";
import { toIsoDate } from "@/utils/date";

export type ActivityDraft = Omit<
  ActivityRecord,
  "id" | "createdAt" | "updatedAt"
>;
export type ProjectDetails = Pick<
  Project,
  "description" | "startDate" | "endDate"
>;

export type AppData = {
  activities: ActivityRecord[];
  projects: Project[];
  categories: CategoryMeta[];
  tags: TagMeta[];
  gakuchikaRecords: GakuchikaRecord[];
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const isValidEs = (es: EsData) =>
  Number.isInteger(es.maxCharacters) &&
  es.maxCharacters > 0 &&
  [...es.content].length <= es.maxCharacters;

export const addActivity = (
  data: AppData,
  draft: ActivityDraft,
): { record: ActivityRecord; changes: Partial<AppData> } => {
  const now = new Date();
  const project = data.projects.find((item) => item.id === draft.projectId);
  const record: ActivityRecord = {
    ...draft,
    id: createId("activity"),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    date: draft.date || toIsoDate(now),
    ...(project ? { categoryKey: project.category } : {}),
  };
  return { record, changes: { activities: [record, ...data.activities] } };
};

export const updateActivity = (
  data: AppData,
  id: string,
  patch: Partial<ActivityRecord>,
): Partial<AppData> => {
  const current = data.activities.find((activity) => activity.id === id);
  const project = data.projects.find(
    (item) => item.id === (patch.projectId ?? current?.projectId),
  );
  return {
    activities: data.activities.map((activity) =>
      activity.id === id
        ? {
            ...activity,
            ...patch,
            ...(project ? { categoryKey: project.category } : {}),
            updatedAt: new Date().toISOString(),
          }
        : activity,
    ),
  };
};

export const deleteActivity = (
  data: AppData,
  id: string,
): Partial<AppData> => ({
  activities: data.activities.filter((activity) => activity.id !== id),
  gakuchikaRecords: data.gakuchikaRecords.map((record) => ({
    ...record,
    relatedActivityIds: record.relatedActivityIds.filter(
      (activityId) => activityId !== id,
    ),
  })),
});

export const addProject = (
  name: string,
  category: Project["category"],
  details?: ProjectDetails,
): { project: Project; changes: Partial<AppData> } => {
  const now = new Date().toISOString();
  const project: Project = {
    id: createId("project"),
    name,
    category,
    ...details,
    createdAt: now,
    updatedAt: now,
  };
  return { project, changes: { projects: [project] } };
};

export const updateProject = (
  data: AppData,
  id: string,
  patch: Partial<
    Pick<Project, "name" | "description" | "category" | "startDate" | "endDate">
  >,
): Partial<AppData> => {
  const projects = data.projects.map((project) =>
    project.id === id
      ? { ...project, ...patch, updatedAt: new Date().toISOString() }
      : project,
  );
  const nextProject = projects.find((project) => project.id === id);
  return {
    projects,
    ...(nextProject
      ? {
          activities: data.activities.map((activity) =>
            activity.projectId === id
              ? { ...activity, categoryKey: nextProject.category }
              : activity,
          ),
        }
      : {}),
  };
};

export const deleteProject = (data: AppData, id: string): Partial<AppData> => {
  const deletedActivityIds = new Set(
    data.activities
      .filter((activity) => activity.projectId === id)
      .map((activity) => activity.id),
  );
  return {
    projects: data.projects.filter((project) => project.id !== id),
    activities: data.activities.filter((activity) => activity.projectId !== id),
    gakuchikaRecords: data.gakuchikaRecords.map((record) => ({
      ...record,
      relatedActivityIds: record.relatedActivityIds.filter(
        (activityId) => !deletedActivityIds.has(activityId),
      ),
    })),
  };
};

export const addCategory = (label: string): CategoryMeta => ({
  key: createId("category"),
  label,
  icon: "folder-outline",
  color: "#475569",
  softColor: "#EAEFF7",
  borderColor: "#CBD5E1",
  description: "ユーザーが追加したカテゴリ",
});

export const addTag = (label: string): TagMeta => ({
  id: createId("tag") as TagId,
  label,
  color: "#2563EB",
  softColor: "#E8F0FF",
});

export const addGakuchika = (
  data: AppData,
  activityIds: string[],
  title?: string,
): { record: GakuchikaRecord; changes: Partial<AppData> } => {
  const now = new Date().toISOString();
  const record: GakuchikaRecord = {
    id: createId("gakuchika"),
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
      data.activities.some((activity) => activity.id === activityId),
    ),
    createdAt: now,
    updatedAt: now,
  };
  return {
    record,
    changes: { gakuchikaRecords: [record, ...data.gakuchikaRecords] },
  };
};

export const updateGakuchika = (
  data: AppData,
  id: string,
  patch: Partial<Omit<GakuchikaRecord, "id">>,
): Partial<AppData> | null => {
  if (patch.es && !isValidEs(patch.es)) return null;
  return {
    gakuchikaRecords: data.gakuchikaRecords.map((record) =>
      record.id === id
        ? {
            ...record,
            ...patch,
            ...(patch.relatedActivityIds
              ? {
                  relatedActivityIds: patch.relatedActivityIds.filter(
                    (activityId) =>
                      data.activities.some(
                        (activity) => activity.id === activityId,
                      ),
                  ),
                }
              : {}),
            updatedAt: new Date().toISOString(),
          }
        : record,
    ),
  };
};

export const saveGakuchika = (data: AppData, id: string): Partial<AppData> => ({
  gakuchikaRecords: data.gakuchikaRecords.map((record) =>
    record.id === id
      ? { ...record, savedAt: new Date().toISOString() }
      : record,
  ),
});

export const saveEs = (
  data: AppData,
  id: string,
  es: EsData,
): Partial<AppData> | null => {
  if (!isValidEs(es)) return null;
  return {
    gakuchikaRecords: data.gakuchikaRecords.map((record) =>
      record.id === id
        ? { ...record, es, updatedAt: new Date().toISOString() }
        : record,
    ),
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
