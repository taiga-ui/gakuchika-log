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
