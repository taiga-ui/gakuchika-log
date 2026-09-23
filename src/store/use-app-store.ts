import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ACTIVITY_CATEGORIES, type CategoryMeta } from "@/constants/categories";
import {
  MOCK_ACTIVITIES,
  MOCK_ES_DRAFTS,
  MOCK_GAKUCHIKA,
  MOCK_PROJECTS,
  PROFILE,
} from "@/constants/mock-data";
import type { TagId, TagMeta } from "@/constants/tags";
import { TAGS } from "@/constants/tags";
import type {
  ActivityRecord,
  EsDraft,
  GakuchikaRecord,
  ProfileSummary,
  Project,
} from "@/types/domain";
import { toIsoDate } from "@/utils/date";

type ActivityDraft = Omit<ActivityRecord, "id" | "createdAt" | "updatedAt">;
const STORAGE_KEY = "gakuchika-log-state-v2";

type AppState = {
  profile: ProfileSummary;
  activities: ActivityRecord[];
  projects: Project[];
  categories: CategoryMeta[];
  tags: TagMeta[];
  lastCreatedProjectId?: string;
  gakuchikaRecords: GakuchikaRecord[];
  esDrafts: EsDraft[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  updateProfile: (patch: Partial<ProfileSummary>) => void;
  addActivity: (draft: ActivityDraft) => ActivityRecord;
  addProject: (name: string, category: Project["category"]) => Project;
  addCategory: (label: string) => CategoryMeta;
  addTag: (label: string) => TagMeta;
  clearLastCreatedProject: () => void;
  updateActivity: (id: string, patch: Partial<ActivityRecord>) => void;
  deleteActivity: (id: string) => void;
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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: PROFILE,
      activities: MOCK_ACTIVITIES,
      projects: MOCK_PROJECTS,
      categories: [...ACTIVITY_CATEGORIES],
      tags: [...TAGS],
      gakuchikaRecords: MOCK_GAKUCHIKA,
      esDrafts: MOCK_ES_DRAFTS,
      searchQuery: "",
      selectedCategory: "all",
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
      addActivity: (draft) => {
        const now = new Date();
        const record: ActivityRecord = {
          ...draft,
          id: createId("activity"),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          date: draft.date || toIsoDate(now),
        };
        set((state) => ({ activities: [record, ...state.activities] }));
        return record;
      },
      updateActivity: (id, patch) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id
              ? { ...activity, ...patch, updatedAt: new Date().toISOString() }
              : activity,
          ),
        })),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
        })),
      addProject: (name, category) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: createId("project"),
          name,
          category,
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
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...patch, updatedAt: new Date().toISOString() }
              : project,
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          activities: state.activities.filter(
            (activity) => activity.projectId !== id,
          ),
        })),
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
        set((state) => ({
          gakuchikaRecords: [record, ...state.gakuchikaRecords],
        }));
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
              ? { ...draft, ...patch, updatedAt: new Date().toISOString() }
              : draft,
          ),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>;

        return {
          ...currentState,
          ...persisted,
          categories: mergeCategories(persisted.categories),
        };
      },
    },
  ),
);
