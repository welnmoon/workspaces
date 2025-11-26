'use client';

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { clientRoutes } from '@/lib/routes/client-routes';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import WorkspaceCardActions from '../workspace-card-actions';
import toast from 'react-hot-toast';
import { useWorkspaceChangeName } from '@/hooks/workspace/use-workspace-change-name';
import { FullRoleDTO } from '@/types/prisma/DTO/role';

type Props = {
  avatarUrl: string;
  workspace: { id: number; name: string };
  role: FullRoleDTO | null;
};

export default function WorkspaceCardClient({
  avatarUrl,
  workspace,
  role,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workspace.name);

  const ref = useRef<HTMLDivElement>(null);
  const { mutate } = useWorkspaceChangeName(workspace.id);

  const startEditing = () => {
    setIsEditing(true);

    // ставим курсор в конец текста
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false); // курсор в конец
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  };

  const stopEditing = (opts?: { cancel?: boolean }) => {
    if (!ref.current) return;

    const newName = ref.current.innerText.trim();

    // отмена → вернуть оригинальное имя
    if (opts?.cancel) {
      ref.current.innerText = name;
      setIsEditing(false);
      return;
    }

    // если не изменилось — просто закрываем edit
    if (newName === name || newName.length === 0) {
      setIsEditing(false);
      return;
    }

    mutate(newName, {
      onSuccess: () => {
        setName(newName);
        setIsEditing(false);
        toast.success('Название обновлено');
      },
      onError: () => {
        toast.error('Ошибка изменения имени');
        ref.current!.innerText = name; // откат
        setIsEditing(false);
      },
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image src={avatarUrl} alt="avatar" width={40} height={40} />
        </div>

        <div className="flex-1 flex items-start gap-2 justify-between min-w-0">
          <CardTitle className="min-w-0">
            <Heading className="font-bold leading-tight break-words" level={2}>
              <div
                ref={ref}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onClick={() => !isEditing && startEditing()}
                onBlur={() => stopEditing()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    stopEditing();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    stopEditing({ cancel: true });
                  }
                }}
                className={`
                  outline-none line-clamp-2
                  ${isEditing ? 'border-b border-primary/40' : 'cursor-pointer underline-anim'}
                `}
              >
                {name}
              </div>
            </Heading>
          </CardTitle>

          <WorkspaceCardActions
            workspaceId={workspace.id}
            workspaceName={workspace.name}
            setEditing={setIsEditing}
            setEditingText={() => {}} // больше не нужен текстовый state
            editing={isEditing}
            editingText={name}
            role={role}
          />
        </div>
      </CardHeader>

      <CardFooter className="text-sm text-muted-foreground">
        Ваша роль: {role}
      </CardFooter>
    </Card>
  );
}
