import type { ImageSourcePropType } from "react-native";

import type { ActivityCategoryKey } from "@/constants/categories";
import type { TagId } from "@/constants/tags";

export type ISODateString = string;

export type PhotoAsset = ImageSourcePropType | null;

export type ActivityRecord = {
  id: string;
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
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type EsDraft = {
  id: string;
  title: string;
  prompt: string;
  content: string;
  wordCount: number;
  relatedGakuchikaId?: string;
  relatedActivityIds: string[];
  updatedAt: ISODateString;
};

export type ProfileSummary = {
  name: string;
  school: string;
  faculty: string;
  grade: string;
  target: string;
};
