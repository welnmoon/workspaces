export function validateId(param: unknown): number {
  if (typeof param !== 'string' && typeof param !== 'number') {
    throw new Error('Invalid ID');
  }

  const id = typeof param === 'number' ? param : Number(param);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid ID');
  }

  return id;
}
