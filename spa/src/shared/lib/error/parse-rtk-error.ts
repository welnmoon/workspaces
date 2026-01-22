import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

type ParsedError = {
  status?:
    | number
    | 'FETCH_ERROR'
    | 'PARSING_ERROR'
    | 'TIMEOUT_ERROR'
    | 'CUSTOM_ERROR';
  message?: string;
};

function parseRtkError(error: unknown): ParsedError {
  if (isFetchBaseQueryError(error)) {
    const { status } = error;

    if (typeof status === 'number') {
      let message: string | undefined;

      const data = (error as FetchBaseQueryError).data;
      if (typeof data === 'string') message = data;
      else if (data && typeof data === 'object' && 'message' in data) {
        const m = (data as { message: string }) && data.message;

        if (typeof m === 'string') {
          message = m;
        }
      }
      return { status, message };
    }

    return { status, message: undefined };
  }

  if (isSerializedError(error)) {
    return { message: error.message };
  }

  return {};
}

export { parseRtkError };
