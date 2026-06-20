export function safeDate(dateValue: any): string | null {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}
