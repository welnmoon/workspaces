import { api } from '../../../app/store/api';
import type { Session } from '../model/types';

export const sessionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSession: build.query<Session, void>({
      query: () => ({
        url: '/me',
      }),
    }),
  }),
});

export const { useGetSessionQuery } = sessionApi;
