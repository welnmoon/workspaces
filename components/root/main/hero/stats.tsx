'use client';

import { useRootStats } from '@/hooks/root/use-root-stats';
// import { RootStats } from '@/app/page';
import StatsCard from './stats-card';

export default function Stats({
  // stats,
  animatedValueClass,
}: {
  // stats: RootStats;
  animatedValueClass: string;
}) {
  const { data: stats, isLoading } = useRootStats();

  if (!isLoading && !stats) {
    return null;
  }

  const data = [
    {
      name: 'Пространства',
      value: stats?.workspaces ?? 0,
      href: '#',
    },
    {
      name: 'Проекты',
      value: stats?.projects ?? 0,
      href: '#',
    },
    {
      name: 'Задачи',
      value: stats?.tasks ?? 0,
      href: '#',
    },
    {
      name: 'Пользователи',
      value: stats?.users ?? 0,
      href: '#',
    },
  ];
  return (
    <dl className="grid grid-cols-2 gap-4 w-full">
      {data.map((item) => (
        <StatsCard
          isLoading={isLoading}
          animatedValueClass={animatedValueClass}
          item={item}
          key={item.name}
        />
      ))}
    </dl>
  );
}
