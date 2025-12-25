export const taskIsExpired = (dueDate: Date | null): boolean => {
  if (!dueDate) {
    return false;
  }
  const today = new Date();
  return dueDate < today;
};
