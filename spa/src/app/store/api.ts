import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://workspaces-phi.vercel.app/api/spa';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,

    credentials: 'include',
  }),
  endpoints: () => ({}),
  tagTypes: ['Users', 'Projects', 'Tasks', 'Sprints', 'Workspaces'],
});
