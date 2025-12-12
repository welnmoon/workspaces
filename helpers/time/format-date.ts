export function formatDateRange(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
  locale: string = 'ru-RU',
  entity?: string // project, sprint ...
): string {
  if (!start && !end)
    return entity ? `Дата ${entity} не выбрана` : 'Дата не выбрана';
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

// ---------------------------------------------- //

export function formatDateTimeRange(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
  locale: string = 'ru-RU',
  entity?: string,
  timeZone?: string // e.g., 'UTC' or 'Europe/Moscow'
): string {
  if (!start && !end)
    return entity ? `Дата ${entity} не выбрана` : 'Дата не выбрана';
  if (start && !end) return `Начало: ${formatDateTime(start, locale, timeZone)}`;
  if (!start && end) return `До: ${formatDateTime(end, locale, timeZone)}`;

  return `${formatDateTime(start!, locale, timeZone)} — ${formatDateTime(end!, locale, timeZone)}`;
}

function formatDateTime(date: Date | string, locale: string, timeZone?: string) {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timeZone,
  });
}
