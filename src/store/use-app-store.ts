import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ACTIVITY_CATEGORIES, type CategoryMeta } from "@/constants/categories";
import {
  MOCK_ACTIVITIES,
  MOCK_GAKUCHIKA,
  MOCK_PROJECTS,
  PROFILE,
} from "@/constants/mock-data";
import { LOCAL_OWNER_ID } from "@/constants/owner";
import type { TagMeta } from "@/constants/tags";
import { TAGS } from "@/constants/tags";
import {
  createAppRepository,
  addCategory as createCategory,
  addTag as createTag,
  mergeCategories,
  type ActivityDraft,
  type AppData,
  type EsDraft,
  type ProjectDetails,
} from "@/data/app-repository";
import { APP_STORAGE_KEY, createAppStorage } from "@/data/local-storage";
import type {
  ActivityRecord,
  GakuchikaRecord,
  ProfileSummary,
  Project,
} from "@/types/domain";
import { ES_DEFAULT_MAX_CHARACTERS } from "@/types/domain";
import { searchRecords, type SearchResult } from "@/utils/search";

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
  operationId?: number,
) => void = () => undefined;

type PersistenceWaiter = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

type PersistenceOperation = {
  status: "saving" | "saved" | "error";
  error?: unknown;
};

const persistenceOperations = new Map<number, PersistenceOperation>();
const persistenceWaiters = new Map<number, PersistenceWaiter[]>();
let latestPersistenceOperationId: number | undefined;

export const waitForPersistence = () =>
  new Promise<void>((resolve, reject) => {
    const operationId = latestPersistenceOperationId;
    if (operationId === undefined) {
      resolve();
      return;
    }

    const operation = persistenceOperations.get(operationId);
    if (operation?.status === "saved") {
      resolve();
      return;
    }
    if (operation?.status === "error") {
      reject(operation.error);
      return;
    }

    const waiters = persistenceWaiters.get(operationId) ?? [];
    waiters.push({ resolve, reject });
    persistenceWaiters.set(operationId, waiters);
  });

type AppState = {
  profile: ProfileSummary;
  activities: ActivityRecord[];
  projects: Project[];
  categories: CategoryMeta[];
  tags: TagMeta[];
  lastCreatedProjectId?: string;
  gakuchikaRecords: GakuchikaRecord[];
  searchQuery: string;
  searchResults: SearchResult[];
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  refreshSearchResults: () => void;
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
    patch: Partial<Pick<Project, "name" | "description" | "category">>,
  ) => void;
  deleteProject: (id: string) => void;
  saveEs: (id: string, es: EsDraft) => boolean;
  addGakuchika: (activityIds: string[], title?: string) => GakuchikaRecord;
  updateGakuchika: (
    id: string,
    patch: Partial<Omit<GakuchikaRecord, "id">>,
  ) => void;
  saveGakuchika: (id: string) => void;
  restoreData: (snapshot: {
    profile: ProfileSummary;
    activities: ActivityRecord[];
    projects: Project[];
    categories: CategoryMeta[];
    tags: TagMeta[];
    gakuchikaRecords: GakuchikaRecord[];
  }) => void;
};

const toAppData = (state: AppState): AppData => state;
const appRepository = createAppRepository(LOCAL_OWNER_ID);

export const normalizeActivityReferences = (
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
    ownerId: activity.ownerId || LOCAL_OWNER_ID,
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
    projects: projects.map((project) => ({
      ...project,
      ownerId: project.ownerId || LOCAL_OWNER_ID,
    })),
    activities: normalizedActivities,
    gakuchikaRecords: gakuchikaRecords.map((record) => {
      const ownerId = record.ownerId || LOCAL_OWNER_ID;
      return {
        ...record,
        ownerId,
        relatedActivityIds: record.relatedActivityIds.filter((id) => {
          const activity = normalizedActivities.find((item) => item.id === id);
          return activityIds.has(id) && activity?.ownerId === ownerId;
        }),
        ...(record.es || !legacyByGakuchikaId.has(record.id)
          ? {}
          : {
              es: {
                ownerId,
                company: "",
                question: legacyByGakuchikaId.get(record.id)!.prompt,
                content: legacyByGakuchikaId.get(record.id)!.content,
                maxCharacters: Math.max(
                  ES_DEFAULT_MAX_CHARACTERS,
                  [...legacyByGakuchikaId.get(record.id)!.content].length,
                ),
              },
            }),
        ...(record.es ? { es: { ...record.es } } : {}),
      };
    }),
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
      searchResults: [],
      selectedCategory: "all",
      setSearchQuery: (query) =>
        set((state) => ({
          searchQuery: query,
          searchResults: searchRecords(query, state),
        })),
      refreshSearchResults: () =>
        set((state) => ({
          searchResults: searchRecords(state.searchQuery, state),
        })),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
      addActivity: (draft) => {
        let record!: ActivityRecord;
        set((state) => {
          const result = appRepository.addActivity(toAppData(state), draft);
          record = result.record;
          return result.changes;
        });
        return record;
      },
      updateActivity: (id, patch) =>
        set((state) =>
          appRepository.updateActivity(toAppData(state), id, patch),
        ),
      deleteActivity: (id) =>
        set((state) => appRepository.deleteActivity(toAppData(state), id)),
      addProject: (name, category, details) => {
        const result = appRepository.addProject(name, category, details);
        set((state) => ({
          projects: [result.project, ...state.projects],
          lastCreatedProjectId: result.project.id,
        }));
        return result.project;
      },
      addCategory: (label) => {
        const category = createCategory(label);
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },
      updateProject: (id, patch) =>
        set((state) =>
          appRepository.updateProject(toAppData(state), id, patch),
        ),
      deleteProject: (id) =>
        set((state) => appRepository.deleteProject(toAppData(state), id)),
      addTag: (label) => {
        const tag = createTag(label);
        set((state) => ({ tags: [...state.tags, tag] }));
        return tag;
      },
      clearLastCreatedProject: () => set({ lastCreatedProjectId: undefined }),
      addGakuchika: (activityIds, title) => {
        let record!: GakuchikaRecord;
        set((state) => {
          const result = appRepository.addGakuchika(
            toAppData(state),
            activityIds,
            title,
          );
          record = result.record;
          return result.changes;
        });
        return record;
      },
      updateGakuchika: (id, patch) =>
        set((state) => {
          return (
            appRepository.updateGakuchika(toAppData(state), id, patch) ?? state
          );
        }),
      saveGakuchika: (id) =>
        set((state) => appRepository.saveGakuchika(toAppData(state), id)),
      restoreData: (snapshot) => set(snapshot),
      saveEs: (id, es) => {
        let changes: Partial<AppData> | null = null;
        set((state) => {
          changes = appRepository.saveEs(toAppData(state), id, es);
          return changes ?? state;
        });
        if (!changes) return false;
        return true;
      },
    }),
    {
      name: APP_STORAGE_KEY,
      storage: createJSONStorage(() =>
        createAppStorage((status, error) => reportStorageStatus(status, error)),
      ),
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

reportStorageStatus = (status, error, operationId) => {
  usePersistenceStore.setState({
    persistenceStatus: status,
    persistenceError: status === "error",
  });

  if (status === "idle" || operationId === undefined) return;

  if (status === "saving") {
    latestPersistenceOperationId = operationId;
  }
  persistenceOperations.set(operationId, { status, error });
  const waiters = persistenceWaiters.get(operationId);
  if (!waiters) {
    if (error) console.error("Failed to save local data", error);
    return;
  }

  persistenceWaiters.delete(operationId);
  if (status === "saved") {
    waiters.forEach(({ resolve }) => resolve());
  }
  if (status === "error") {
    waiters.forEach(({ reject }) => reject(error));
    console.error("Failed to save local data", error);
  }
};

export const rehydrateApp = () => {
  void useAppStore.persist.rehydrate();
};

export const retryPersistence = () => {
  useAppStore.setState((state) => ({ ...state }));
};
