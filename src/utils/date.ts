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
