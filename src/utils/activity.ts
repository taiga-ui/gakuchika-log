import type { ActivityRecord } from "@/types/domain";

const compareDatesDescending = (left: string, right: string) => {
  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);
  const leftIsValid = Number.isFinite(leftTime);
  const rightIsValid = Number.isFinite(rightTime);

  if (leftIsValid !== rightIsValid) return leftIsValid ? -1 : 1;
  if (!leftIsValid) return 0;
  return rightTime - leftTime;
};

export const getRecentActivities = (activities: ActivityRecord[], limit = 3) =>
  [...activities]
    .sort((left, right) => {
      const dateOrder = compareDatesDescending(left.date, right.date);
      if (dateOrder !== 0) return dateOrder;

      const updatedOrder = compareDatesDescending(
        left.updatedAt,
        right.updatedAt,
      );
      if (updatedOrder !== 0) return updatedOrder;

      return compareDatesDescending(left.createdAt, right.createdAt);
    })
    .slice(0, limit);
