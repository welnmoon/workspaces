import { api } from '../../../app/store/api';
import type {
  WorkspaceFullDTO,
  WorkspaceDTO,
} from '../../../types/DTO/workspace';
import type { EditWorkspace } from '../model/schema';

export const workspaceEditApi = api.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useUpdateWorkspaceMutation } = workspaceEditApi;
