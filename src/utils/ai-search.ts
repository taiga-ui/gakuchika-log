import { LOCAL_OWNER_ID } from "@/constants/owner";
import type { AiSearchResult } from "@/types/ai-search";
import type { ActivityRecord, GakuchikaRecord, Project } from "@/types/domain";

export type AiSource =
  | { kind: "activity"; id: string; title: string; description: string }
  | { kind: "project"; id: string; title: string; description: string }
  | { kind: "gakuchika"; id: string; title: string; description: string };

export type AiSourceData = {
  activities: ActivityRecord[];
  projects: Project[];
  gakuchikaRecords: GakuchikaRecord[];
};

export function resolveAiSource(
  sourceId: string,
  { activities, projects, gakuchikaRecords }: AiSourceData,
): AiSource | null {
  const activity = activities.find(
    (item) => item.id === sourceId && item.ownerId === LOCAL_OWNER_ID,
  );
  if (activity) {
    return {
      kind: "activity",
      id: activity.id,
      title: activity.title,
      description: activity.body,
    };
  }

  const project = projects.find(
    (item) => item.id === sourceId && item.ownerId === LOCAL_OWNER_ID,
  );
  if (project) {
    return {
      kind: "project",
      id: project.id,
      title: project.name,
      description: project.description ?? "",
    };
  }

  const gakuchika = gakuchikaRecords.find(
    (item) => item.id === sourceId && item.ownerId === LOCAL_OWNER_ID,
  );
  if (gakuchika) {
    return {
      kind: "gakuchika",
      id: gakuchika.id,
      title: gakuchika.title,
      description: gakuchika.overview,
    };
  }

  return null;
}

export function getAiResultSources(
  result: AiSearchResult,
  data: AiSourceData,
): Array<AiSource | { kind: "missing"; id: string }> {
  return result.sourceIds.map(
    (sourceId) =>
      resolveAiSource(sourceId, data) ?? { kind: "missing", id: sourceId },
  );
}
