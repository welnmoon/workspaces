import { env } from '../config/env';
import { withQuery } from '../url/with-query';
import type { LoginParams } from './types';

export const mainPaths = {
  auth: {
    login: (params?: LoginParams) => {
      const newUrl = withQuery(`${env.API_ORIGIN}/login`, {
        reason: params?.reason,
        from: params?.from,
      });

      return newUrl;
    },
  },
  // TODO: продолжи добавлять пути и используй в AdminGate (<Navigate to="/login" replace />)
};
