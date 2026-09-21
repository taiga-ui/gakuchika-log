import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

type AppState = {
  profile: ProfileSummary;
  activities: ActivityRecord[];
  projects: Project[];
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
  addProject: (name: string, categoryKey: Project["categoryKey"]) => Project;
  addTag: (label: string) => TagMeta;
  clearLastCreatedProject: () => void;
  updateActivity: (id: string, patch: Partial<ActivityRecord>) => void;
  addEsDraft: (draft: Omit<EsDraft, "id" | "updatedAt">) => EsDraft;
  updateEsDraft: (id: string, patch: Partial<Omit<EsDraft, "id">>) => void;
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: PROFILE,
      activities: MOCK_ACTIVITIES,
      projects: MOCK_PROJECTS,
      tags: [...TAGS],
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

        set((state) => ({ activities: [record, ...state.activities] }));

        return record;
      },
      addProject: (name, categoryKey) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: createId("project"),
          name,
          categoryKey,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          projects: [...state.projects, project],
          lastCreatedProjectId: project.id,
        }));
        return project;
      },
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
      updateActivity: (id, patch) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id
              ? {
                  ...activity,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                }
              : activity,
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
    }),
    {
      name: "gakuchika-log-store",
      storage: createJSONStorage(() =>
        typeof globalThis.localStorage === "undefined"
          ? memoryStorage
          : globalThis.localStorage,
      ),
      merge: (persisted, current) => {
        const saved = persisted as Partial<AppState>;
        return {
          ...current,
          ...saved,
          projects: saved.projects ?? current.projects,
          tags: saved.tags ?? current.tags,
        };
      },
    },
  ),
);
