import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserDTO } from '../../types/DTO/user';
import type { WorkspaceDTO } from '../../types/DTO/workspace';

export type UserResponse = {
  data: UserDTO[];
};

export type WorkspaceResponse = {
  data: WorkspaceDTO[];
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/spa',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, void>({
      query: () => `/users`,
      transformResponse: (res: UserResponse): UserResponse => {
        return {
          data: res.data.map((u) => ({
            ...u,
            wasOnline: u.wasOnline
              ? new Intl.DateTimeFormat('ru-RU', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(u.wasOnline))
              : null,
          })),
        };
      },
    }),
    getWorkspaces: builder.query<WorkspaceResponse, void>({
      query: () => `/workspaces`,
    }),
  }),
});
export const { useGetUsersQuery, useGetWorkspacesQuery } = api;
