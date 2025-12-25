export const isValidDate = (d: Date | undefined) =>
  d instanceof Date && !isNaN(d.getTime());
