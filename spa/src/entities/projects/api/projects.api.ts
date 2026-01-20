import { api } from '../../../app/store/api';
import type { ProjectFullDTO } from '../../../shared/types/DTO/project';

interface DeleteProjectReq {
  id: number;
}

export const projectsApi = api.injectEndpoints({
  endpoints: (build) => ({
                       
    getProjects: build.query<{ data: ProjectFullDTO[] }, void>({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
    }),
                  
    getProject: build.query<ProjectFullDTO, void>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'GET',
      }),
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
  }),
});

export const {
  useGetProjectQuery,
  useGetProjectsQuery,
  useDeleteProjectMutation,
} = projectsApi;
