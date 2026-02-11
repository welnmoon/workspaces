import { api } from '../../../app/store/api';
import type { ApiResponse } from '../../../shared/types/api/types';
import type { ProjectListItemDto } from '../../../shared/types/DTO/project';
import type { EditProjectType } from '../model/schema';

interface DeleteProjectReq {
  id: number;
}

interface UpdateProjectReq {
  id: number;
  body: EditProjectType;
}

export const projectsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<{ data: ProjectListItemDto[] }, void>({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
    }),

    getProject: build.query<ProjectListItemDto, number>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<ProjectListItemDto>) => res.data,
    }),

    deleteProject: build.mutation<void, DeleteProjectReq>({
      query: ({ id }) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(deletingProject, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          projectsApi.util.updateQueryData(
            'getProjects',
            undefined,
            (draft) => {
              const index = draft.data.findIndex(
                (project) => project.id === deletingProject.id
              );
              if (index !== -1) {
                draft.data.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();
        }
      },
    }),

    updateProject: build.mutation<ProjectListItemDto, UpdateProjectReq>({
      queryFn: async ({ id, body }, _api, _extraOptions, fetchWithBQ) => {
        const result = await fetchWithBQ({
          url: `/projects/${id}`,
          method: 'PATCH',
          body,
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: result.data as ProjectListItemDto };
      },

      invalidatesTags: ['Projects'],
    }),
  }),
});

export const {
  useGetProjectQuery,
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} = projectsApi;
