import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserDTO } from '../types/DTO/user';

export type UserResponse = {
  data: UserDTO[];
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/system',
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
  }),
});
export const { useGetUsersQuery } = api;
