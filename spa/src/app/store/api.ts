import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserDTO, UserFullDTO } from '../../types/DTO/user';
import type { WorkspaceDTO } from '../../types/DTO/workspace';

export type UsersResponse = {
  data: UserDTO[];
};

export type UserResponse = {
  data: UserFullDTO;
};

export type WorkspacesResponse = {
  data: WorkspaceDTO[];
};

export type WorkspaceRes = {
  data: WorkspaceDTO;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/spa',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => `/users`,
      transformResponse: (res: UsersResponse): UsersResponse => {
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
    getUser: builder.query<UserResponse, string>({
      // UserResponse - возвращаемый тип, string - аргумент
      query: (id) => `/users/${id}`,
    }),
    getWorkspaces: builder.query<WorkspacesResponse, void>({
      query: () => `/workspaces`,
    }),
    getWorkspace: builder.query<WorkspaceRes, string>({
      query: (id) => `workspaces/${id}`,
    }),
  }),
});
export const {
  useGetUsersQuery,
  useGetWorkspacesQuery,
  useGetUserQuery,
  useGetWorkspaceQuery,
} = api;
