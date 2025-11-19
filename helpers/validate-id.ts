export function validateId(param: unknown): number {
  if (typeof param !== 'string') {
    throw new Error('Invalid ID');
  }

  const id = Number(param);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid ID');
  }

  return id;
}
