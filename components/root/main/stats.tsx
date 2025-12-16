'use client';

import { RootStats } from '@/app/page';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  ];
  return (
    <div className="flex items-center justify-between w-full">
      <dl className="flex justify-between flex-wrap w-full">
        {data.map((item) => (
          <Card key={item.name} className="p-0 gap-0 w-[30%] shadow-none">
            <CardContent className="p-6">
              <dd className="flex items-start justify-between space-x-2">
                <span className="truncate text-sm text-muted-foreground">
                  {item.name}
                </span>
                {/* <span
                  className={cn(
                    'text-sm font-medium',
                    item.changeType === 'positive'
                      ? 'text-emerald-700 dark:text-emerald-500'
                      : 'text-red-700 dark:text-red-500'
                  )}
                >
                  {item.change}
                </span> */}
              </dd>
              <dd className="mt-1 text-3xl font-semibold text-foreground">
                {item.value}
              </dd>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border p-0!">
              <a
                href={item.href}
                className="px-6 py-3 text-sm font-medium text-primary hover:text-primary/90"
              >
                View more &#8594;
              </a>
            </CardFooter>
          </Card>
        ))}
      </dl>
    </div>
  );
}
