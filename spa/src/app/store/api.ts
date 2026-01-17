import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/spa',

    credentials: 'include',
  }),
  endpoints: () => ({}),
  tagTypes: ['Users', 'Projects', 'Tasks', 'Sprints', 'Workspaces'],
});
