'use client';

import { RootStats } from '@/app/page';
import StatsCard from './stats-card';

export default function Stats({ stats }: { stats: RootStats }) {
  const data = [
    {
      name: 'Workspaces',
      value: stats.workspaces,
      href: '#',
    },
    {
      name: 'Projects',
      value: stats.projects,
      href: '#',
    },
    {
      name: 'Tasks',
      value: stats.tasks,
      href: '#',
    },
    {
      name: 'Пользователи',
      value: stats.users,
      href: '#',
    },
  ];
  return (
    <dl className="grid grid-cols-2 gap-4">
      {data.map((item) => (
        <StatsCard item={item} key={item.name} />
      ))}
    </dl>
  );
}
