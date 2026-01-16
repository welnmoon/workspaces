import { api } from '../../../app/store/api';
import type { WorkspaceFullDTO } from '../../../shared/types/DTO/workspace';
import type { EditWorkspace } from '../model/schema';

interface DeleteWorkspaceReq {
  id: number;
}

export type WorkspacesResponse = {
  data: WorkspaceFullDTO[];
};

export type WorkspaceRes = {
  data: WorkspaceFullDTO;
};

export const workspaceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // get all workspaces
    getWorkspaces: builder.query<WorkspacesResponse, void>({
      query: () => `/workspaces`,
    }),
    // get workspace
    getWorkspace: builder.query<WorkspaceRes, string>({
      query: (id) => `workspaces/${id}`,
    }),
    // delete workspace
    deleteWorkspace: builder.mutation<void, DeleteWorkspaceReq>({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(deletingWorkspace, { dispatch, queryFulfilled }) {
        const patchRes = dispatch(
          workspaceApi.util.updateQueryData(
            'getWorkspaces',
            undefined,
            (draft) => {
              draft.data = draft.data.filter(
                (w) => w.id !== deletingWorkspace.id
              );
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (e) {
          patchRes.undo();
        }
      },
    }),
    // update workspace
    updateWorkspace: builder.mutation<
      WorkspaceFullDTO,
      { id: string; body: EditWorkspace }
    >({
      query: ({ id, body }) => ({
        url: `/workspaces/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useGetWorkspacesQuery,
  useGetWorkspaceQuery,
} = workspaceApi;
