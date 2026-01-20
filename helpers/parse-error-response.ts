import { AppError } from '@/lib/errors';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
                                                   
                                                                
                               
                                          
                                            
                                    

function pickString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v : null;
}

export async function parseErrorResponse(res: Response): Promise<AppError> {
  let data: unknown = null;

  try {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = (await res.json()) as unknown;
    } else {
      const text = await res.text();
      data = text ? { message: text } : null;
    }
  } catch {
    data === null;
  }

  let message: string | null = null;
  let code: string | null = null;

  if (isRecord(data)) {
    message = pickString(data.message) ?? pickString(data.error) ?? null;
    code = pickString(data.code) ?? null;
  }

  if (!message) {
    message = `Ошибка ${res.status} при запросе к серверу`;
  }

  return new AppError(res.status, code || 'UNKNOWN_ERROR', message);
}
