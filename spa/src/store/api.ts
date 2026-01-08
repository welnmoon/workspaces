import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      // any[] → что вернёт сервер (массив пользователей)
      // void → какие аргументы принимает запрос (ничего)
      query: () => `/users`,
    }),
  }),
});

export const { useGetUsersQuery } = api;
