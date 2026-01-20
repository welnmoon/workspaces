import { api } from '../../../app/store/api';
import type { UserDTO, UserFullDTO } from '../../../shared/types/DTO/user';
import type { EditUserSchemaType } from '../model/schema';

interface DeleteUserReq {
  id: string;
}

export type UpdateUserReq = {
  id: string;
  body: EditUserSchemaType;
};

export type UserResponse = {
  data: UserFullDTO;
};

export type UsersResponse = {
  data: UserDTO[];
};

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
                    
    getUsers: builder.query<UsersResponse, void>({
      query: () => `/users`,
      providesTags: (result) => [
        { type: 'Users', id: 'LIST' },
        ...(result?.data.map(({ id }) => ({ type: 'Users' as const, id })) ||
          []),
      ],
    }),
               
    getUser: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Users'],
    }),
                  
    deleteUser: builder.mutation<void, DeleteUserReq>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(deletingUser, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUsers', undefined, (draft) => {
            draft.data = draft.data.filter((u) => u.id !== deletingUser.id);
          })
        );

        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();
        }
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
                  
    updateUser: builder.mutation<UserFullDTO, UpdateUserReq>({
                                                                  
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
  useGetUserQuery,
} = userApi;
