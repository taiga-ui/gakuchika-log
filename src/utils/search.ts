import type { TagMeta } from "@/constants/tags";
import type { ActivityRecord, GakuchikaRecord, Project } from "@/types/domain";

export type SearchResultKind = "activity" | "project" | "gakuchika" | "es";

export type SearchResult = {
  id: string;
  kind: SearchResultKind;
  label: string;
  title: string;
  description: string;
  route:
    | `/activities/${string}`
    | `/projects/${string}`
    | `/gakuchika/${string}`;
};

type SearchData = {
  activities: ActivityRecord[];
  projects: Project[];
  gakuchikaRecords: GakuchikaRecord[];
  tags: TagMeta[];
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("ja-JP");

const includesQuery = (values: string[], query: string) =>
  values.some((value) => normalize(value).includes(query));

export function searchRecords(query: string, data: SearchData): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const projectNames = new Map(
    data.projects.map((project) => [project.id, project.name]),
  );
  const tagNames = new Map(data.tags.map((tag) => [tag.id, tag.label]));
  const results: SearchResult[] = [];

  data.activities.forEach((activity) => {
    const values = [
      activity.title,
      activity.body,
      activity.location ?? "",
      activity.photoLabel ?? "",
      ...(activity.metrics ?? []),
      projectNames.get(activity.projectId) ?? "",
      ...activity.tagIds.map((tagId) => tagNames.get(tagId) ?? ""),
    ];
    if (includesQuery(values, normalizedQuery)) {
      results.push({
        id: activity.id,
        kind: "activity",
        label: "活動記録",
        title: activity.title,
        description: activity.body,
        route: `/activities/${activity.id}`,
      });
    }
  });

  data.projects.forEach((project) => {
    if (
      includesQuery([project.name, project.description ?? ""], normalizedQuery)
    ) {
      results.push({
        id: project.id,
        kind: "project",
        label: "プロジェクト",
        title: project.name,
        description: project.description ?? "",
        route: `/projects/${project.id}`,
      });
    }
  });

  data.gakuchikaRecords.forEach((record) => {
    const values = [
      record.title,
      record.overview,
      record.period,
      record.role,
      record.challenge,
      record.difficulty,
      record.action,
      record.result,
      record.learning,
      record.artifact,
      ...record.numbers,
    ];
    if (includesQuery(values, normalizedQuery)) {
      results.push({
        id: record.id,
        kind: "gakuchika",
        label: "ガクチカ",
        title: record.title,
        description: record.overview,
        route: `/gakuchika/${record.id}`,
      });
    }
    if (record.es) {
      const esValues = [
        record.es.company,
        record.es.question,
        record.es.content,
      ];
      if (includesQuery(esValues, normalizedQuery)) {
        results.push({
          id: record.id,
          kind: "es",
          label: "ES",
          title: record.es.company || record.title,
          description: record.es.question || record.es.content,
          route: `/gakuchika/${record.id}`,
        });
      }
    }
  });

  return results;
}
