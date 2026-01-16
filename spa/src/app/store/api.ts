import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_ORIGIN}/api/spa` || "http://workspaces-phi.vercel.app",
    credentials: 'include',
  }),
  endpoints: () => ({}),
  tagTypes: ['Users', 'Projects', 'Tasks', 'Sprints', 'Workspaces'],
});
