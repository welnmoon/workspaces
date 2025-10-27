import { Project } from '@prisma/client';
import { Heading } from '../ui/heading';
import Divider from '../divider';
import Description from '../ui/desc';

const ProjectComponent = ({ project }: { project: Project }) => {
  if (!project) return null;
  return (
    <article>
      <Heading>Project {project.name}</Heading>
      <Description text={project.description || 'No description'} />
      <Divider />
      <Heading>Tasks</Heading>
    </article>
  );
};

export default ProjectComponent;
