// utils/date.ts
import { format } from "date-fns";

export const setDateParam = (
  params: URLSearchParams,
  key: string,
  date?: Date
) => {
  if (date) {
    params.set(key, format(date, "yyyy-MM-dd"));
  } else {
    params.delete(key);
  }
};