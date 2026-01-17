export function formatDateTimeRu(
  date: Date | string | null | undefined
): string {
  if (!date) return '—';

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}
