export function dateToString(date: Date) {
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

export function stringToDate(date: string) {
  return new Date(date);
}

export function getYear(date?: Date) {
  return (date ?? new Date()).getFullYear().toString();
}

export function formatDate(backendDate: string) {
  return dateToString(stringToDate(backendDate));
}
