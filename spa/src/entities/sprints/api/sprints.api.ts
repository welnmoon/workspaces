import { api } from '../../../app/store/api';
import type { SprintDTO } from '../../../shared/types/DTO/sprint';

interface DeleteSprintReq {
  id: number;
}

export const sprintsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // get all sprints
    getSprints: builder.query<SprintDTO[], void>({
      query: () => ({
        url: '/sprints',
        method: 'GET',
      }),
    }),
    // get sprint
    getSprint: builder.query<SprintDTO, number>({
      query: (id) => ({
        url: `/sprints/${id}`,
        method: 'GET',
      }),
    }),
    // delete sprint
    deleteSprint: builder.mutation<void, DeleteSprintReq>({
      query: ({ id }) => ({
        url: `/sprints/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(deletingSprint, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          sprintsApi.util.updateQueryData('getSprints', undefined, (draft) => {
            const index = draft.findIndex(
              (sprint) => sprint.id === deletingSprint.id
            );
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetSprintQuery, useGetSprintsQuery, useDeleteSprintMutation } =
  sprintsApi;
