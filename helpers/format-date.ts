export function formatDateRange(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
  locale: string = 'ru-RU'
): string {
  if (!start && !end) return 'Дата не выбрана';
  if (start && !end) return `Начало: ${format(start, locale)}`;
  if (!start && end) return `До: ${format(end, locale)}`;

  return `${format(start!, locale)} — ${format(end!, locale)}`;
}

function format(date: Date | string, locale: string) {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
