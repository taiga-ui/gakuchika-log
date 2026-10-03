import type { ActivityRecord } from "@/types/domain";
import { getRecentActivities } from "@/utils/activity";

const makeActivity = (
  id: string,
  date: string,
  updatedAt = `${date}T00:00:00.000Z`,
): ActivityRecord => ({
  id,
  ownerId: "local",
  projectId: "project-1",
  title: id,
  body: "本文",
  categoryKey: "research",
  tagIds: [],
  date,
  createdAt: `${date}T00:00:00.000Z`,
  updatedAt,
});

describe("getRecentActivities", () => {
  it("returns all activities when fewer than three exist", () => {
    const activities = [makeActivity("only", "2026-01-01")];

    expect(getRecentActivities(activities)).toEqual(activities);
    expect(getRecentActivities([])).toEqual([]);
  });

  it("returns the three newest activities without changing the source order", () => {
    const activities = [
      makeActivity("old", "2026-01-01"),
      makeActivity("newest", "2026-03-01"),
      makeActivity("middle", "2026-02-01"),
      makeActivity("newer", "2026-02-15"),
    ];

    expect(
      getRecentActivities(activities).map((activity) => activity.id),
    ).toEqual(["newest", "newer", "middle"]);
    expect(activities.map((activity) => activity.id)).toEqual([
      "old",
      "newest",
      "middle",
      "newer",
    ]);
  });

  it("uses updatedAt for activities with the same date and puts invalid dates last", () => {
    const activities = [
      makeActivity("invalid", "not-a-date"),
      makeActivity("older-edit", "2026-04-01", "2026-04-01T09:00:00.000Z"),
      makeActivity("newer-edit", "2026-04-01", "2026-04-01T10:00:00.000Z"),
    ];

    expect(
      getRecentActivities(activities).map((activity) => activity.id),
    ).toEqual(["newer-edit", "older-edit", "invalid"]);
  });
});
