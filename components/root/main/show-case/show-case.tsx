'use client';
// Workspace Switcher — выбор рабочего пространства, роль пользователя

import s from './layout.module.css';
import CaseCard from './case-card';
import MembersAndRoles from './members-roles/members-roles';
import Kanban from './kanban';
import { InvitationNotificationView } from './notifications/invites';
import { WorkspaceCardView } from './presentational/workspace-card-view';
import { ProjectCardView } from './presentational/project-card-view';
import { TaskCardView } from './presentational/task-card-view';
import { NotificationView } from './notifications/notification-view';
import AuditsView from './presentational/audits-view';
import SLAGaugeView from './presentational/sla-gauge-view';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';

// Project Card — метрики проекта, прогресс/статусы

// Task Card — приоритет, дедлайн, исполнитель, статус

// Kanban Board — DnD, статусы, фильтры

// Members & Roles — OWNER/ADMIN/MEMBER (это прям важная фича)

// Invites — приглашение по email/ссылка

// Billing / Plan — Free vs Pro, ограничения, апгрейд (Stripe)

// Activё

// Analytics Widget — графики “created vs completed” и т.п.

// Empty/Skeleton/Error states — покажи “качество”, а не только happy path

const ShowCase = () => {
  return (
    <section>
      <h2 className="visually-hidden">Show Worknest advantages</h2>
      <div className="mb-6">
        <span className="font-semibold text-zinc-500">Worknest</span>
        <Heading level={1} className="mb-4 mt-4">
          Показательные компоненты для управления проектами и командами
        </Heading>
        <span className="text-zinc-500 text-xl">
          Примеры карточек рабочих пространств, проектов и задач, доска Канбан,
        </span>
      </div>
      <div className="mx-auto flex flex-col border border-zinc-100 rounded-md ">
        {/* COL #1 */}
        <aside className="w-full flex flex-col md:flex-row lg:border-r border-zinc-100">
          <CaseCard
            title="Пространства"
            info="Ключевые данные по рабочему пространству"
          >
            <WorkspaceCardView
              name="Product Ops HQ"
              description="Главная точка команды: роли, уведомления, канбан и аудит активности."
              roleLabel="Owner"
              membersCount={18}
              projectsCount={6}
            />
          </CaseCard>

          <CaseCard
            title="Проекты"
            info="Прогресс, задачи и спринты по проекту"
          >
            <ProjectCardView
              title="Запуск весеннего релиза"
              description="Фичи, дедлайны и метрики проекта в одном месте: видно прогресс и риски."
              tasksTotal={42}
              tasksDone={18}
              tasksInProgress={16}
              tasksToDo={6}
              tasksOverdue={3}
              tasksBlocked={2}
              sprintsCount={3}
            />
          </CaseCard>
          <CaseCard
            title="Задачи"
            info="Карточка задачи с приоритетом и сроком"
          >
            <TaskCardView
              title="Онбординг для новых клиентов"
              description="Собрать сценарий, подготовить контент, проставить дедлайны и ответственных."
              status="IN_PROGRESS"
              priority="HIGH"
              dueDate="2024-08-30T00:00:00.000Z"
              assigneeLabel="Алибеков Нартай"
              projectLabel="Весенний релиз"
              workspaceLabel="Product Ops HQ"
              taskId={12890}
            />
          </CaseCard>
        </aside>

        {/* COL #2  GRID */}
        <div className={s.root}>
          <Kanban
            className={s.kanban}
            info="В канбан доске вы можете перетаскивать задачи между статусами"
          />
          <MembersAndRoles className={s.members} />
          <CaseCard
            title="Уведомления"
            containerClassName={s.notifications}
            info="Приглашения и алерты по проектам и воркспейсам"
          >
            <InvitationNotificationView
              workspaceLabel="Product Ops HQ"
              invitedRole="Admin"
              status="PENDING"
              inviterLabel="Элшатұлы Нұрсұлтан"
              showActions={false}
            />
            <NotificationView
              title="Уведомление о дедлайне"
              message="Через 2 дня заканчивается срок задачи «Онбординг для новых клиентов»."
              createdAt={new Date()}
              isRead={false}
              workspaceLabel="Product Ops HQ"
              workspaceHref="/w/100"
              showActions={false}
              type="warning"
            />
            <NotificationView
              title="Рабочее пространство удалено"
              message="Workspace «Marketing Ops» удален администратором. Доступ закрыт, данные перенесены в архив."
              createdAt={new Date()}
              isRead={false}
              workspaceLabel="Marketing Ops"
              workspaceHref="/w/404"
              showActions={false}
              type="error"
            />
          </CaseCard>
          <CaseCard
            title="Аудит"
            containerClassName={s.audit}
            info="Журнал последних действий в проекте"
          >
            <AuditsView
              audits={[
                {
                  id: 1,
                  userName: 'Нартай Алибеков',
                  action: 'TASK_STATUS_CHANGED',
                  entityType: 'TASK',
                  entityId: 2331,
                  createdAt: new Date(),
                },
                {
                  id: 2,
                  userName: 'Элшатұлы Нұрсұлтан',
                  action: 'PROJECT_RENAMED',
                  entityType: 'PROJECT',
                  entityId: 401,
                  createdAt: new Date(),
                },
                {
                  id: 3,
                  userName: 'Элшатұлы Нұрсұлтан',
                  action: 'DELETE_TASK',
                  entityType: 'TASK',
                  entityId: 2331,
                  createdAt: new Date(),
                },
              ]}
            />
          </CaseCard>
          <CaseCard
            title="Аналитика"
            containerClassName={cn(s.analytics, 'h-max')}
            info="SLA по задачам с дедлайном"
          >
            <SLAGaugeView
              sla={86}
              completedInDeadline={24}
              totalWithDeadline={28}
            />
          </CaseCard>
        </div>
      </div>{' '}
    </section>
  );
};

export default ShowCase;
