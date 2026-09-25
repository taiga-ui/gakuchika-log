import type { ImageSourcePropType } from "react-native";

import type { ActivityCategoryKey } from "@/constants/categories";
import type { TagId } from "@/constants/tags";

export type ISODateString = string;

export type PhotoAsset = ImageSourcePropType | null;

export type Project = {
  id: string;
  name: string;
  description?: string;
  category: ActivityCategoryKey;
  startDate?: ISODateString;
  endDate?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type ActivityRecord = {
  id: string;
  projectId: string;
  title: string;
  body: string;
  categoryKey: ActivityCategoryKey;
  tagIds: TagId[];
  date: ISODateString;
  photoAsset?: PhotoAsset;
  photoLabel?: string;
  metrics?: string[];
  location?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export const ES_DEFAULT_MAX_CHARACTERS = 400;

export type EsData = {
  company: string;
  question: string;
  maxCharacters: number;
  content: string;
};

export type GakuchikaRecord = {
  id: string;
  title: string;
  overview: string;
  period: string;
  role: string;
  challenge: string;
  difficulty: string;
  action: string;
  result: string;
  learning: string;
  numbers: string[];
  artifact: string;
  relatedActivityIds: string[];
  reflection?: Partial<{
    activity: string;
    challenge: string;
    difficulty: string;
    action: string;
    role: string;
    result: string;
    learning: string;
  }>;
  es?: EsData;
  savedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type ProfileSummary = {
  name: string;
  school: string;
  faculty: string;
  grade: string;
  target: string[];
};
