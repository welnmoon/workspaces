export const formatTime = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};
