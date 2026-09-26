import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ACTIVITY_CATEGORIES, type CategoryMeta } from "@/constants/categories";
import {
  MOCK_ACTIVITIES,
  MOCK_GAKUCHIKA,
  MOCK_PROJECTS,
  PROFILE,
} from "@/constants/mock-data";
import type { TagId, TagMeta } from "@/constants/tags";
import { TAGS } from "@/constants/tags";
import type {
  ActivityRecord,
  EsData,
  GakuchikaRecord,
  ProfileSummary,
  Project,
} from "@/types/domain";
import { ES_DEFAULT_MAX_CHARACTERS } from "@/types/domain";
import { toIsoDate } from "@/utils/date";

type ActivityDraft = Omit<ActivityRecord, "id" | "createdAt" | "updatedAt">;
type ProjectDetails = Pick<Project, "description" | "startDate" | "endDate">;
const STORAGE_KEY = "gakuchika-log-state-v2";

type HydrationStatus = "loading" | "hydrated" | "error";
type PersistenceStatus = "idle" | "saving" | "saved" | "error";

type PersistenceRuntimeState = {
  hydrationStatus: HydrationStatus;
  hydrationError: boolean;
  persistenceStatus: PersistenceStatus;
  persistenceError: boolean;
};

export const usePersistenceStore = create<PersistenceRuntimeState>(() => ({
  hydrationStatus: "loading",
  hydrationError: false,
  persistenceStatus: "idle",
  persistenceError: false,
}));

let reportStorageStatus: (
  status: PersistenceStatus,
  error?: unknown,
) => void = () => undefined;

const appStorage = {
  getItem: (name: string) => AsyncStorage.getItem(name),
  setItem: async (name: string, value: string) => {
    reportStorageStatus("saving");
    try {
      await AsyncStorage.setItem(name, value);
      reportStorageStatus("saved");
    } catch (error) {
      reportStorageStatus("error", error);
      throw error;
    }
  },
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};

const isValidEs = (es: EsData) =>
  Number.isInteger(es.maxCharacters) &&
  es.maxCharacters > 0 &&
  [...es.content].length <= es.maxCharacters;

type AppState = {
  profile: ProfileSummary;
  activities: ActivityRecord[];
  projects: Project[];
  categories: CategoryMeta[];
  tags: TagMeta[];
  lastCreatedProjectId?: string;
  gakuchikaRecords: GakuchikaRecord[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  updateProfile: (patch: Partial<ProfileSummary>) => void;
  addActivity: (draft: ActivityDraft) => ActivityRecord;
  addProject: (
    name: string,
    category: Project["category"],
    details?: ProjectDetails,
  ) => Project;
  addCategory: (label: string) => CategoryMeta;
  addTag: (label: string) => TagMeta;
  clearLastCreatedProject: () => void;
  updateActivity: (id: string, patch: Partial<ActivityRecord>) => void;
  deleteActivity: (id: string) => void;
  updateProject: (
    id: string,
    patch: Partial<
      Pick<
        Project,
        "name" | "description" | "category" | "startDate" | "endDate"
      >
    >,
  ) => void;
  deleteProject: (id: string) => void;
  saveEs: (id: string, es: EsData) => boolean;
  addGakuchika: (activityIds: string[], title?: string) => GakuchikaRecord;
  updateGakuchika: (
    id: string,
    patch: Partial<Omit<GakuchikaRecord, "id">>,
  ) => void;
  saveGakuchika: (id: string) => void;
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const mergeCategories = (persistedCategories?: CategoryMeta[]) => {
  const savedCategories = persistedCategories ?? [];
  const builtInKeys = new Set<string>(
    ACTIVITY_CATEGORIES.map((category) => category.key),
  );
  const customCategories = savedCategories.filter(
    (category) => !builtInKeys.has(category.key),
  );

  return [...ACTIVITY_CATEGORIES, ...customCategories];
};

const normalizeActivityReferences = (
  activities: ActivityRecord[],
  projects: Project[],
  gakuchikaRecords: GakuchikaRecord[],
  legacyEsDrafts: unknown[] = [],
) => {
  const activityIds = new Set(activities.map((activity) => activity.id));
  const projectCategories = new Map(
    projects.map((project) => [project.id, project.category]),
  );
  const normalizedActivities = activities.map((activity) => ({
    ...activity,
    categoryKey:
      projectCategories.get(activity.projectId) ?? activity.categoryKey,
  }));

  const legacyByGakuchikaId = new Map(
    legacyEsDrafts
      .filter(
        (
          draft,
        ): draft is {
          relatedGakuchikaId: string;
          content: string;
          prompt: string;
        } =>
          typeof draft === "object" &&
          draft !== null &&
          typeof (draft as Record<string, unknown>).relatedGakuchikaId ===
            "string" &&
          typeof (draft as Record<string, unknown>).content === "string" &&
          typeof (draft as Record<string, unknown>).prompt === "string",
      )
      .map((draft) => [draft.relatedGakuchikaId, draft] as const),
  );

  return {
    activities: normalizedActivities,
    gakuchikaRecords: gakuchikaRecords.map((record) => ({
      ...record,
      relatedActivityIds: record.relatedActivityIds.filter((id) =>
        activityIds.has(id),
      ),
      ...(record.es || !legacyByGakuchikaId.has(record.id)
        ? {}
        : {
            es: {
              company: "",
              question: legacyByGakuchikaId.get(record.id)!.prompt,
              content: legacyByGakuchikaId.get(record.id)!.content,
              maxCharacters: Math.max(
                ES_DEFAULT_MAX_CHARACTERS,
                [...legacyByGakuchikaId.get(record.id)!.content].length,
              ),
            },
          }),
    })),
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: PROFILE,
      activities: MOCK_ACTIVITIES,
      projects: MOCK_PROJECTS,
      categories: [...ACTIVITY_CATEGORIES],
      tags: [...TAGS],
      gakuchikaRecords: MOCK_GAKUCHIKA,
      searchQuery: "",
      selectedCategory: "all",
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
      addActivity: (draft) => {
        const now = new Date();
        let record: ActivityRecord = {
          ...draft,
          id: createId("activity"),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          date: draft.date || toIsoDate(now),
        };
        set((state) => {
          const project = state.projects.find(
            (item) => item.id === record.projectId,
          );
          if (project) record = { ...record, categoryKey: project.category };
          return { activities: [record, ...state.activities] };
        });
        return record;
      },
      updateActivity: (id, patch) =>
        set((state) => {
          const current = state.activities.find(
            (activity) => activity.id === id,
          );
          const project = state.projects.find(
            (item) => item.id === (patch.projectId ?? current?.projectId),
          );
          return {
            activities: state.activities.map((activity) =>
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
        }),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
          gakuchikaRecords: state.gakuchikaRecords.map((record) => ({
            ...record,
            relatedActivityIds: record.relatedActivityIds.filter(
              (activityId) => activityId !== id,
            ),
          })),
        })),
      addProject: (name, category, details) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: createId("project"),
          name,
          category,
          ...details,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: [project, ...state.projects],
          lastCreatedProjectId: project.id,
        }));
        return project;
      },
      addCategory: (label) => {
        const category: CategoryMeta = {
          key: createId("category"),
          label,
          icon: "folder-outline",
          color: "#475569",
          softColor: "#EAEFF7",
          borderColor: "#CBD5E1",
          description: "ユーザーが追加したカテゴリ",
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },
      updateProject: (id, patch) =>
        set((state) => {
          const nextProjects = state.projects.map((project) =>
            project.id === id
              ? { ...project, ...patch, updatedAt: new Date().toISOString() }
              : project,
          );
          const nextProject = nextProjects.find((project) => project.id === id);
          return {
            projects: nextProjects,
            ...(nextProject
              ? {
                  activities: state.activities.map((activity) =>
                    activity.projectId === id
                      ? { ...activity, categoryKey: nextProject.category }
                      : activity,
                  ),
                }
              : {}),
          };
        }),
      deleteProject: (id) =>
        set((state) => {
          const deletedActivityIds = new Set(
            state.activities
              .filter((activity) => activity.projectId === id)
              .map((activity) => activity.id),
          );
          const removeDeletedActivities = (ids: string[]) =>
            ids.filter((activityId) => !deletedActivityIds.has(activityId));
          return {
            projects: state.projects.filter((project) => project.id !== id),
            activities: state.activities.filter(
              (activity) => activity.projectId !== id,
            ),
            gakuchikaRecords: state.gakuchikaRecords.map((record) => ({
              ...record,
              relatedActivityIds: removeDeletedActivities(
                record.relatedActivityIds,
              ),
            })),
          };
        }),
      addTag: (label) => {
        const tag: TagMeta = {
          id: createId("tag") as TagId,
          label,
          color: "#2563EB",
          softColor: "#E8F0FF",
        };
        set((state) => ({ tags: [...state.tags, tag] }));
        return tag;
      },
      clearLastCreatedProject: () => set({ lastCreatedProjectId: undefined }),
      addGakuchika: (activityIds, title) => {
        const now = new Date().toISOString();
        let record!: GakuchikaRecord;
        set((state) => {
          record = {
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
              state.activities.some((activity) => activity.id === activityId),
            ),
            createdAt: now,
            updatedAt: now,
          };
          return { gakuchikaRecords: [record, ...state.gakuchikaRecords] };
        });
        return record;
      },
      updateGakuchika: (id, patch) =>
        set((state) => {
          if (patch.es && !isValidEs(patch.es)) return state;
          return {
            gakuchikaRecords: state.gakuchikaRecords.map((record) =>
              record.id === id
                ? {
                    ...record,
                    ...patch,
                    ...(patch.relatedActivityIds
                      ? {
                          relatedActivityIds: patch.relatedActivityIds.filter(
                            (activityId) =>
                              state.activities.some(
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
        }),
      saveGakuchika: (id) =>
        set((state) => ({
          gakuchikaRecords: state.gakuchikaRecords.map((record) =>
            record.id === id
              ? { ...record, savedAt: new Date().toISOString() }
              : record,
          ),
        })),
      saveEs: (id, es) => {
        if (!isValidEs(es)) {
          return false;
        }
        set((state) => ({
          gakuchikaRecords: state.gakuchikaRecords.map((record) =>
            record.id === id
              ? { ...record, es, updatedAt: new Date().toISOString() }
              : record,
          ),
        }));
        return true;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => appStorage),
      onRehydrateStorage: () => (state, error) => {
        usePersistenceStore.setState({
          hydrationStatus: error ? "error" : "hydrated",
          hydrationError: Boolean(error),
        });
        if (state && error) {
          console.error("Failed to restore local data", error);
        }
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>;
        const persistedProfile = persisted.profile;
        const isSeedProfile =
          /^山田[ \u3000]太郎$/.test(persistedProfile?.name ?? "") &&
          persistedProfile?.school === "Gakuchika University";

        const merged = {
          ...currentState,
          ...persisted,
          profile: isSeedProfile
            ? currentState.profile
            : persistedProfile
              ? {
                  ...currentState.profile,
                  ...persistedProfile,
                  target:
                    typeof persistedProfile.target === "string"
                      ? [persistedProfile.target]
                      : (persistedProfile.target ??
                        currentState.profile.target),
                }
              : currentState.profile,
          categories: mergeCategories(persisted.categories),
        };
        const legacyEsDrafts = Array.isArray(
          (persisted as { esDrafts?: unknown }).esDrafts,
        )
          ? ((persisted as { esDrafts: unknown[] }).esDrafts ?? [])
          : [];
        const { esDrafts: _legacyEsDrafts, ...stateWithoutLegacyEsDrafts } =
          merged as typeof merged & { esDrafts?: unknown };
        return {
          ...stateWithoutLegacyEsDrafts,
          ...normalizeActivityReferences(
            merged.activities,
            merged.projects,
            merged.gakuchikaRecords,
            legacyEsDrafts,
          ),
        };
      },
    },
  ),
);

reportStorageStatus = (status, error) => {
  usePersistenceStore.setState({
    persistenceStatus: status,
    persistenceError: status === "error",
  });
  if (error) {
    console.error("Failed to save local data", error);
  }
};

export const rehydrateApp = () => {
  void useAppStore.persist.rehydrate();
};

export const retryPersistence = () => {
  useAppStore.setState((state) => ({ ...state }));
};
