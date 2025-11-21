import { AppError } from '@/lib/errors';

export async function checkResponse(res: Response, code = 400) {
  if (res.ok) return;

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  const message =
    data?.message || data?.error || res.statusText || 'Unknown server error';

  throw new AppError(code, 'HTTP_ERROR', message);
}
