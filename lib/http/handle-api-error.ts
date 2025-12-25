import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@/lib/errors';
import {
  badRequest,
  conflict,
  serverError,
  unprocessable,
  notFound,
} from './http';

type Handler = (message?: string, code?: string) => Response;
type ErrorMap = Record<number, Handler>;

const defaultMap: ErrorMap = {
  400: (msg, code) => badRequest(msg || 'Bad request', code),
  404: (msg, code) => notFound?.(msg || 'Not found') ?? badRequest(msg, code),
  409: (msg, code) => conflict(msg || 'Conflict', code),
  422: (msg) => unprocessable(msg || 'Unprocessable entity'),
};

function handlePrisma(e: Prisma.PrismaClientKnownRequestError) {
  if (e.code === 'P2002') return conflict(e.message, e.code);
  if (e.code === 'P2025')
    return notFound?.(e.message) ?? badRequest(e.message, e.code);
  return unprocessable(e.message || e.code);
}

export function handleApiError(
  e: unknown,
  fallback = 'Server error',
  map: ErrorMap = defaultMap
) {
  if (e instanceof AppError) {
    const handler = map[e.status];
    if (handler) return handler(e.message, e.code);
    return new Response(JSON.stringify({ code: e.code, message: e.message }), {
      status: e.status,
    });
  }

  if (e instanceof ZodError) {
    return unprocessable(e.message);
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrisma(e);
  }

  console.error('Unexpected error in API route:', e);
  return serverError(fallback, e);
}
