'use client';

import { RootStats } from '@/app/page';
import StatsCard from './stats-card';

export default function Stats({ stats, animatedValueClass }: { stats: RootStats, animatedValueClass: string }) {
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
        <StatsCard animatedValueClass={animatedValueClass} item={item} key={item.name} />
      ))}
    </dl>
  );
}
