import { ACTIVITY_CATEGORIES, type CategoryMeta } from "@/constants/categories";
import { LOCAL_OWNER_ID } from "@/constants/owner";
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

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const isValidEs = (es: Pick<EsData, "maxCharacters" | "content">) =>
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
    ownerId: LOCAL_OWNER_ID,
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
  const current = data.activities.find(
    (activity) => activity.id === id && activity.ownerId === LOCAL_OWNER_ID,
  );
  const project = data.projects.find(
    (item) =>
      item.id === (patch.projectId ?? current?.projectId) &&
      item.ownerId === LOCAL_OWNER_ID,
  );
  return {
    activities: data.activities.map((activity) =>
      activity.id === id && activity.ownerId === LOCAL_OWNER_ID
        ? {
            ...activity,
            ...patch,
            ownerId: LOCAL_OWNER_ID,
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
  activities: data.activities.filter(
    (activity) => !(activity.id === id && activity.ownerId === LOCAL_OWNER_ID),
  ),
  gakuchikaRecords: data.gakuchikaRecords.map((record) =>
    record.ownerId === LOCAL_OWNER_ID
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
});

export const addProject = (
  name: string,
  category: Project["category"],
  details?: ProjectDetails,
): { project: Project; changes: Partial<AppData> } => {
  const now = new Date().toISOString();
  const project: Project = {
    id: createId("project"),
    ownerId: LOCAL_OWNER_ID,
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
  patch: Partial<Pick<Project, "name" | "description" | "category">>,
): Partial<AppData> => {
  const now = new Date().toISOString();
  const projects = data.projects.map((project) =>
    project.id === id && project.ownerId === LOCAL_OWNER_ID
      ? { ...project, ...patch, updatedAt: now }
      : project,
  );
  const nextProject = projects.find(
    (project) => project.id === id && project.ownerId === LOCAL_OWNER_ID,
  );
  return {
    projects,
    ...(nextProject
      ? {
          activities: data.activities.map((activity) =>
            activity.projectId === id && activity.ownerId === LOCAL_OWNER_ID
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
};

export const deleteProject = (data: AppData, id: string): Partial<AppData> => {
  const deletedActivityIds = new Set(
    data.activities
      .filter(
        (activity) =>
          activity.projectId === id && activity.ownerId === LOCAL_OWNER_ID,
      )
      .map((activity) => activity.id),
  );
  return {
    projects: data.projects.filter(
      (project) => !(project.id === id && project.ownerId === LOCAL_OWNER_ID),
    ),
    activities: data.activities.filter(
      (activity) =>
        !(activity.projectId === id && activity.ownerId === LOCAL_OWNER_ID),
    ),
    gakuchikaRecords: data.gakuchikaRecords.map((record) =>
      record.ownerId === LOCAL_OWNER_ID
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
    ownerId: LOCAL_OWNER_ID,
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
          activity.id === activityId && activity.ownerId === LOCAL_OWNER_ID,
      ),
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
      record.id === id && record.ownerId === LOCAL_OWNER_ID
        ? {
            ...record,
            ...patch,
            ownerId: LOCAL_OWNER_ID,
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

export const saveGakuchika = (data: AppData, id: string): Partial<AppData> => {
  const now = new Date().toISOString();
  return {
    gakuchikaRecords: data.gakuchikaRecords.map((record) =>
      record.id === id && record.ownerId === LOCAL_OWNER_ID
        ? { ...record, ownerId: LOCAL_OWNER_ID, savedAt: now, updatedAt: now }
        : record,
    ),
  };
};

export const saveEs = (
  data: AppData,
  id: string,
  es: EsDraft,
): Partial<AppData> | null => {
  if (!isValidEs(es)) return null;
  return {
    gakuchikaRecords: data.gakuchikaRecords.map((record) =>
      record.id === id && record.ownerId === LOCAL_OWNER_ID
        ? {
            ...record,
            es: { ...es, ownerId: LOCAL_OWNER_ID },
            updatedAt: new Date().toISOString(),
          }
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
