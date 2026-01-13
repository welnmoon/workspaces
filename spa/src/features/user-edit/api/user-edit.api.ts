import { api } from '../../../app/store/api';
import type { UserFullDTO } from '../../../types/DTO/user';
import type { EditUser } from '../model/schema';

export type UpdateUserReq = {
  id: string;
  body: EditUser;
};

export const userEditApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<UserFullDTO, UpdateUserReq>({
      // UserFullDTO - возвращаемый тип, UpdateUserReq - аргумент
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useUpdateUserMutation } = userEditApi;
