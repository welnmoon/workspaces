export const subDays = (date: Date | string, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};
