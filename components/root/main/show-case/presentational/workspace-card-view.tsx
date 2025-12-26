'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Users } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type WorkspaceCardViewProps = {
  name: string;
  description?: string | null;
  roleLabel?: string | null;
  membersCount?: number;
  projectsCount?: number;
  avatarUrl?: string | null;
};

export function WorkspaceCardView({
  name,
  description,
  roleLabel,
  membersCount,
  projectsCount,
  avatarUrl,
}: WorkspaceCardViewProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();


  return (
    <TooltipProvider>
      <div className="flex gap-3 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm">
        <Avatar className="h-10 w-10">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="text-xs">{initials || 'W'}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-[18px] font-semibold leading-tight underline-anim">
              {name}
            </p>
            {roleLabel && (
              <Badge variant="outline" className="text-[11px]">
                {roleLabel}
              </Badge>
            )}
          </div>

          {description && (
            <p className="text-[14px] leading-snug text-muted-foreground">
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            {typeof membersCount === 'number' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 cursor-default">
                    <Users className="h-4 w-4" />
                    {membersCount} участников
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Количество участников в пространстве
                </TooltipContent>
              </Tooltip>
            )}
            {typeof projectsCount === 'number' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 cursor-default">
                    <FolderKanban className="h-4 w-4" />
                    {projectsCount} проектов
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Количество проектов в пространстве
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
