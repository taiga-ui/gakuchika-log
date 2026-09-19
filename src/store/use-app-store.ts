import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import {
  MOCK_ACTIVITIES,
  MOCK_ES_DRAFTS,
  MOCK_GAKUCHIKA,
  MOCK_PROJECTS,
  PROFILE,
} from "@/constants/mock-data";
import type {
  ActivityRecord,
  EsDraft,
  GakuchikaRecord,
  ProfileSummary,
  Project,
} from "@/types/domain";
import { toIsoDate } from "@/utils/date";

type ActivityDraft = Omit<ActivityRecord, "id" | "createdAt" | "updatedAt">;
type ProjectDraft = Omit<Project, "id" | "createdAt" | "updatedAt">;
const STORAGE_KEY = "gakuchika-log-state-v2";

type AppState = {
  profile: ProfileSummary;
  activities: ActivityRecord[];
  projects: Project[];
  gakuchikaRecords: GakuchikaRecord[];
  esDrafts: EsDraft[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  updateProfile: (patch: Partial<ProfileSummary>) => void;
  addActivity: (draft: ActivityDraft) => ActivityRecord;
  updateActivity: (id: string, patch: Partial<ActivityRecord>) => void;
  deleteActivity: (id: string) => void;
  addProject: (draft: ProjectDraft) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addGakuchika: (activityIds: string[], title?: string) => GakuchikaRecord;
  updateGakuchika: (
    id: string,
    patch: Partial<Omit<GakuchikaRecord, "id">>,
  ) => void;
  saveGakuchika: (id: string) => void;
  addEsDraft: (draft: Omit<EsDraft, "id" | "updatedAt">) => EsDraft;
  updateEsDraft: (id: string, patch: Partial<Omit<EsDraft, "id">>) => void;
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const persist = (state: Partial<AppState>) => {
  void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
    // Expo Go can run without the native AsyncStorage module linked.
  });
};

const restorePersistedState = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    // Keep the bundled initial state when local storage is unavailable.
    return null;
  }
};

export const useAppStore = create<AppState>((set) => ({
  profile: PROFILE,
  activities: MOCK_ACTIVITIES,
  projects: MOCK_PROJECTS,
  gakuchikaRecords: MOCK_GAKUCHIKA,
  esDrafts: MOCK_ES_DRAFTS,
  searchQuery: "",
  selectedCategory: "all",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  updateProfile: (patch) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...patch,
      },
    })),
  addActivity: (draft) => {
    const now = new Date();
    const record: ActivityRecord = {
      ...draft,
      id: createId("activity"),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      date: draft.date || toIsoDate(now),
    };

    set((state) => {
      const next = { activities: [record, ...state.activities] };
      persist({ ...state, ...next });
      return next;
    });

    return record;
  },
  updateActivity: (id, patch) =>
    set((state) => {
      const next = {
        activities: state.activities.map((activity) =>
          activity.id === id
            ? {
                ...activity,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : activity,
        ),
      };
      persist({ ...state, ...next });
      return next;
    }),
  deleteActivity: (id) =>
    set((state) => {
      const next = {
        activities: state.activities.filter((activity) => activity.id !== id),
      };
      persist({ ...state, ...next });
      return next;
    }),
  addProject: (draft) => {
    const now = new Date().toISOString();
    const project: Project = {
      ...draft,
      id: createId("project"),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => {
      const next = { projects: [project, ...state.projects] };
      persist({ ...state, ...next });
      return next;
    });
    return project;
  },
  updateProject: (id, patch) =>
    set((state) => {
      const next = {
        projects: state.projects.map((project) =>
          project.id === id
            ? { ...project, ...patch, updatedAt: new Date().toISOString() }
            : project,
        ),
      };
      persist({ ...state, ...next });
      return next;
    }),
  deleteProject: (id) =>
    set((state) => {
      const next = {
        projects: state.projects.filter((project) => project.id !== id),
        activities: state.activities.filter(
          (activity) => activity.projectId !== id,
        ),
      };
      persist({ ...state, ...next });
      return next;
    }),
  addGakuchika: (activityIds, title) => {
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
      relatedActivityIds: activityIds,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ gakuchikaRecords: [record, ...state.gakuchikaRecords] }));
    return record;
  },
  updateGakuchika: (id, patch) =>
    set((state) => ({
      gakuchikaRecords: state.gakuchikaRecords.map((record) =>
        record.id === id
          ? { ...record, ...patch, updatedAt: new Date().toISOString() }
          : record,
      ),
    })),
  saveGakuchika: (id) =>
    set((state) => ({
      gakuchikaRecords: state.gakuchikaRecords.map((record) =>
        record.id === id
          ? { ...record, savedAt: new Date().toISOString() }
          : record,
      ),
    })),
  addEsDraft: (draft) => {
    const record: EsDraft = {
      ...draft,
      id: createId("es"),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({ esDrafts: [record, ...state.esDrafts] }));

    return record;
  },
  updateEsDraft: (id, patch) =>
    set((state) => ({
      esDrafts: state.esDrafts.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : draft,
      ),
    })),
}));

void restorePersistedState().then((value) => {
  if (!value) return;
  try {
    const saved = JSON.parse(value) as Partial<AppState>;
    const savedProjects = saved.projects ?? MOCK_PROJECTS;
    const migratedActivities = (saved.activities ?? MOCK_ACTIVITIES).map(
      (activity) => {
        if (activity.projectId) return activity;
        const legacyCategory =
          (activity as ActivityRecord & { categoryKey?: Project["category"] })
            .categoryKey ?? "study";
        return { ...activity, projectId: `legacy-${legacyCategory}` };
      },
    );
    const legacyProjects = migratedActivities
      .filter(
        (activity) =>
          !savedProjects.some((project) => project.id === activity.projectId),
      )
      .map((activity) => {
        const legacyCategory =
          (activity as ActivityRecord & { categoryKey?: Project["category"] })
            .categoryKey ?? "study";
        return {
          id: `legacy-${legacyCategory}`,
          name: "旧データの活動",
          category: legacyCategory,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
    useAppStore.setState({
      ...saved,
      projects: [...savedProjects, ...legacyProjects],
      activities: migratedActivities,
    });
  } catch {
    // Keep bundled initial data when local data is malformed.
  }
});
