export function dateToString(
  date: Date,
  options: Intl.DateTimeFormatOptions = {}
) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
    ...options,
  });
}

export function stringToDate(date: string) {
  return new Date(date);
}

export function getYear(date?: Date) {
  return (date ?? new Date()).getFullYear();
}

export function formatDate(
  backendDate: string,
  options: Intl.DateTimeFormatOptions = {}
) {
  return dateToString(stringToDate(backendDate), options);
}
