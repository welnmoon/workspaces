import { AppError } from '@/lib/errors';

export async function parseErrorResponse(res: Response): Promise<AppError> {
  let data: any = null;

  try {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { message: text } : null;
    }
  } catch {}

  const message =
    data?.message ||
    data?.error ||
    `Ошибка ${res.status} при запросе к серверу`;
  const code = data?.code;

  return new AppError(message, String(res.status), code);
}
