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
                         
    getWorkspaces: builder.query<WorkspacesResponse, void>({
      query: () => `/workspaces`,
    }),
                    
    getWorkspace: builder.query<WorkspaceRes, string>({
      query: (id) => `workspaces/${id}`,
    }),
                       
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
