import { AppError } from '@/lib/errors';

export function validateId(param: unknown): number {
  if (typeof param !== 'string' && typeof param !== 'number') {
    throw new AppError(400, 'INVALID_ID', 'Invalid ID');
  }

  const id = typeof param === 'number' ? param : Number(param);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'INVALID_ID', 'Invalid ID');
  }

  return id;
}
