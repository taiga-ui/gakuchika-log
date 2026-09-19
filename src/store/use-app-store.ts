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
  updateProfile: (patch: Partial<ProfileSummary>) => void;
  addActivity: (draft: ActivityDraft) => ActivityRecord;
  updateActivity: (id: string, patch: Partial<ActivityRecord>) => void;
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

export const useAppStore = create<AppState>((set) => ({
  profile: PROFILE,
  activities: MOCK_ACTIVITIES,
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
