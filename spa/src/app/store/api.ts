import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.PROD
      ? '/api/spa'
      : import.meta.env.VITE_API_ORIGIN
        ? `${import.meta.env.VITE_API_ORIGIN}/api/spa`
        : '/api/spa',

    credentials: 'include',
  }),
  endpoints: () => ({}),
  tagTypes: ['Users', 'Projects', 'Tasks', 'Sprints', 'Workspaces'],
});
