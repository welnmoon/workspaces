import { api } from '../../../app/store/api';
import type { TaskDTO } from '../../../shared/types/DTO/task';

interface DeleteTaskReq {
  id: number;
}

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // get all tasks
    getTasks: builder.query<TaskDTO[], void>({
      query: () => ({
        url: '/tasks',
        method: 'GET',
      }),
    }),
    // get task
    getTask: builder.query<TaskDTO, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'GET',
      }),
    }),
    // delete task
    deleteTask: builder.mutation<void, DeleteTaskReq>({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(deletingTask, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            const index = draft.findIndex(
              (task) => task.id === deletingTask.id
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

export const { useGetTaskQuery, useGetTasksQuery, useDeleteTaskMutation } =
  tasksApi;
