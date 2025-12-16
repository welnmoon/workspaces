'use client';

import { createContext, useContext } from 'react';

type ProjectLockValue = {
  locked: boolean;
  reason?: string;
};

const ProjectLockContext = createContext<ProjectLockValue | null>(null);

export function ProjectLockProvider({
  value,
  children,
}: {
  value: ProjectLockValue;
  children: React.ReactNode;
}) {
  return (
    <ProjectLockContext.Provider value={value}>
      {children}
    </ProjectLockContext.Provider>
  );
}

export function useProjectLock() {
  const ctx = useContext(ProjectLockContext);
  if (!ctx)
    throw new Error('useProjectLock must be used within a ProjectLockProvider');
  return ctx;
}
