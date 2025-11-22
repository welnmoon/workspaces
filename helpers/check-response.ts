import { AppError } from '@/lib/errors';

export async function checkResponse(res: Response, code = 400) {
  if (res.ok) return;

  let data: unknown = null;

  try {
    data = await res.json();
  } catch {}

  let message = res.statusText || 'Unknown server error';

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;

    if (typeof obj.message === 'string') {
      message = obj.message;
    } else if (typeof obj.error === 'string') {
      message === obj.error;
    }
  }

  throw new AppError(code, 'HTTP_ERROR', message);
}
