const parseNumericId = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

export const parseTaskId = (value: string) => parseNumericId(value);
export const parseSprintId = (value: string) => parseNumericId(value);
export const parseProjectId = (value: string) => parseNumericId(value);
