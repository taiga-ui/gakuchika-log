import type { ActivityRecord } from "@/types/domain";

export type ContributionCell = {
  date: string;
  count: number;
};

const pad = (value: number) => value.toString().padStart(2, "0");

export function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIsoDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatJapaneseDate(dateValue: string) {
  const date = parseIsoDate(dateValue);
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

export function formatMonthLabel(dateValue: string) {
  const date = parseIsoDate(dateValue);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

export function formatRelativeDate(dateValue: string) {
  const today = new Date();
  const target = parseIsoDate(dateValue);
  const diff = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) {
    return "今日";
  }

  if (diff === 1) {
    return "昨日";
  }

  if (diff < 7) {
    return `${diff}日前`;
  }

  return formatJapaneseDate(dateValue);
}

export function countRecordsThisMonth(records: ActivityRecord[]) {
  const now = new Date();
  return records.filter((record) => {
    const date = parseIsoDate(record.date);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }).length;
}

export function calculateStreak(records: ActivityRecord[]) {
  const dates = new Set(records.map((record) => record.date));
  const current = new Date();
  let streak = 0;

  for (;;) {
    const isoDate = toIsoDate(current);
    if (!dates.has(isoDate)) {
      break;
    }

    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

export function buildContributionGrid(
  records: ActivityRecord[],
  weekCount = 6,
) {
  const recordMap = new Map<string, number>();

  records.forEach((record) => {
    recordMap.set(record.date, (recordMap.get(record.date) ?? 0) + 1);
  });

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - weekCount * 7 + 1);

  const cells: ContributionCell[] = [];

  for (let index = 0; index < weekCount * 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const isoDate = toIsoDate(date);
    cells.push({ date: isoDate, count: recordMap.get(isoDate) ?? 0 });
  }

  return cells;
}

export function getActivityMonthLabel(records: ActivityRecord[]) {
  const firstRecord = [...records].sort((left, right) =>
    right.date.localeCompare(left.date),
  )[0];
  return firstRecord
    ? formatMonthLabel(firstRecord.date)
    : formatMonthLabel(toIsoDate(new Date()));
}
