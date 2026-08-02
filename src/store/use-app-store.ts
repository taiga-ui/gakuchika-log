import { create } from "zustand";

import {
  MOCK_ACTIVITIES,
  MOCK_ES_DRAFTS,
  MOCK_GAKUCHIKA,
  PROFILE,
} from "@/constants/mock-data";
import type {
  ActivityRecord,
  EsDraft,
  GakuchikaRecord,
  ProfileSummary,
} from "@/types/domain";
import { toIsoDate } from "@/utils/date";

type ActivityDraft = Omit<ActivityRecord, "id" | "createdAt" | "updatedAt">;

type AppState = {
  profile: ProfileSummary;
  activities: ActivityRecord[];
  gakuchikaRecords: GakuchikaRecord[];
  esDrafts: EsDraft[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addActivity: (draft: ActivityDraft) => ActivityRecord;
  updateActivity: (id: string, patch: Partial<ActivityRecord>) => void;
  addEsDraft: (draft: Omit<EsDraft, "id" | "updatedAt">) => EsDraft;
  updateEsDraft: (id: string, patch: Partial<Omit<EsDraft, "id">>) => void;
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const useAppStore = create<AppState>((set) => ({
  profile: PROFILE,
  activities: MOCK_ACTIVITIES,
  gakuchikaRecords: MOCK_GAKUCHIKA,
  esDrafts: MOCK_ES_DRAFTS,
  searchQuery: "",
  selectedCategory: "all",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
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
}));
