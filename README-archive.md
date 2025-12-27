# Worknest

Платформа для командной работы: **воркспейсы → проекты → задачи** с ролями, уведомлениями и аналитикой.
Ключевая ценность — **дашборд** для управления работой команды и метриками по задачам/проектам.

## Содержание

- [🚀 Dashboard (главное)](#-dashboard-главное)
- [✨ Основные возможности](#-основные-возможности)
- [🧱 Архитектура](#-архитектура)
- [🛠 Технологии](#-технологии)
- [⚙️ Запуск локально](#️-запуск-локально)
- [📁 Структура проекта](#-структура-проекта)
- [🧪 Качество](#-качество)
- [🗺 Roadmap / Что можно улучшить](#-roadmap--что-можно-улучшить)
- [📄 Лицензия](#-лицензия)
- [Pitch for interview](#pitch-for-interview)

---

## 🚀 Dashboard (главное)

### Что это за Dashboard

Dashboard — это защищённая часть приложения (`app/(dashboard)/*`), где пользователь управляет:
- воркспейсами и участниками,
- проектами и их жизненным циклом,
- задачами (список/канбан/бэклог),
- аналитикой по задачам и активности,
- уведомлениями,
- действиями уровня воркспейса (инвайты, оповещения, покупка тарифа, PDF‑отчёт).

### Основные экраны/метрики/виджеты

#### 1) Workspace Overview (обзор воркспейса)
**Route:** `app/(dashboard)/w/[workspaceId]/page.tsx`

Показывает ключевые счётчики (виджеты в `components/entities/workspaces/workspace-overview.tsx`):
- **Участники** (`membersCount`)
- **Проекты** (`projectsCount`)
- **Задачи**:
  - всего (`tasksTotal`)
  - в работе (`tasksInProgress`)
  - выполнено (`tasksDone`)
  - новые/TODO (`tasksToDoCount`)
  - просроченные (`tasksOverdue`)

Дополнительно:
- **роль пользователя** в воркспейсе и **тариф** (визуальный бейдж)
- ссылка на **журнал аудита** воркспейса

Данные для overview агрегируются серверно: `lib/services/func/get-workspace-stats.ts`.

#### 2) Workspace actions menu (действия администратора воркспейса)
**UI:** `components/entities/workspaces/workspace-popover.tsx`

Доступно для `OWNER/ADMIN` (проверка на странице воркспейса):
- приглашение пользователя (`components/dialogs/invite-user-dialog.tsx`)
- редактирование воркспейса (`components/dialogs/edit-workspace-dialog.tsx`)
- отправка уведомления в воркспейс (`components/entities/workspaces/workspace-notify-button`)
- покупка тарифа (`src/features/billing/buy-tariff/buy-tariff.action.tsx`)
- скачивание PDF‑отчёта по задачам (`src/features/reports/download-report/download-report.action.tsx` + `app/api/report/pdf/route.ts`)

#### 3) Project Dashboard (внутри проекта)
**Route:** `app/(dashboard)/w/[workspaceId]/projects/[projectId]/page.tsx`

Проект включает вкладки (UI и логика): `components/entities/projects/tabs/project-tabs.tsx`
- **Список** задач по спринтам (есть создание спринта)
- **Канбан** с drag&drop (перетаскивание задач)
- **Бэклог** (задачи без спринта)
- **Аналитика** (графики)

##### Аналитика проекта (графики)
Сетка графиков: `components/entities/projects/project-tasks-stats.tsx`, включает:
- **SLA gauge** — % задач, закрытых в срок (`components/charts/sla-gauge.tsx`, API `app/api/charts/.../sla-tasks/route.ts`)
- **Cumulative done** — кумулятив выполнения (`components/charts/cumulative-done-chart.tsx`)
- **Daily done** — выполнено по дням (`components/charts/daily-done-chart.tsx`, API `.../done-tasks/route.ts`)
- **Created vs Completed** — создано vs завершено (`components/charts/created-vs-done-tasks-chart.tsx`, API `.../created-vs-completed-tasks/route.ts`)
- **Tasks by status (pie)** — распределение по статусам (`components/charts/tasks-by-status-pie-chart.tsx`, данные берутся из `/api/project/[projectId]/stats`)
- **User activity** — активность участников (`components/charts/user-activity-bar-chart.tsx`, API `.../user-activity/route.ts`)

##### Управление жизненным циклом проекта
На странице проекта есть action «**завершить/вернуть проект**» (lock):
- UI: `components/entities/projects/project.tsx`
- API: `app/api/w/[workspaceId]/projects/[projectId]/toggle-end/route.ts`

Когда проект завершён — редактирование задач блокируется логикой `ProjectLockProvider`.

#### 4) Журнал аудита воркспейса
**Route:** `app/(dashboard)/w/[workspaceId]/activity/page.tsx`
- Получение: `AuditLogService.getWorkspaceLogs` (`lib/services/audit-log.ts` — файл не проверял детально в этом документе)
- UI: `components/entities/audit/audits`

#### 5) Уведомления
**Route:** `app/(dashboard)/notifications/page.tsx` (найдено по поиску `requireUser()`)
- Server side: `NotificationService.getNotifications` (`lib/services/notification` — не найдено в карте открытых файлов, но вызов есть в `app/(dashboard)/notifications/page.tsx`)
- UI popover в хедере dashboard layout: `components/entities/notifications/notifications-popover`.

### Ключевые пользовательские сценарии
- Зайти в dashboard → выбрать воркс��ейс → увидеть overview по задачам/проектам/участникам.
- Внутри воркспейса перейти в проект → вести задачи:
  - работать со спринтами,
  - перетаскивать задачи на канбане,
  - смотреть аналитику и SLA.
- Администратор воркспейса: пригласить участника, отредактировать воркспейс, отправить уведомление.
- Сгенерировать и скачать **PDF‑отчёт** по задачам.

### Скриншоты
- В репозитории есть папка `public/images/` (например, используется `/images/workspaces/project-bg.jpg` в `components/entities/projects/project.tsx`).
- **TODO:** добавьте реальные скриншоты dashboard в репозиторий, например:
  - `public/images/screens/dashboard-workspace-overview.png`
  - `public/images/screens/project-kanban.png`
  - `public/images/screens/project-analytics.png`

---

## ✨ Основные возможности

1. **Воркспейсы и участники**: роли, список участников, инвайты (`app/(dashboard)/w/*`, `lib/services/workspace`, `lib/services/membership`, `components/entities/workspaces/*`).
2. **Проекты внутри воркспейса**: создание/редактирование, завершение/возврат проекта (`components/entities/projects/*`, `app/api/w/[workspaceId]/projects/[projectId]/toggle-end/route.ts`).
3. **Задачи**: CRUD и статусы (TODO / IN_PROGRESS / DONE / BLOCKED) (`prisma/schema.prisma`, `app/api/w/[workspaceId]/projects/[projectId]/tasks/*`, `components/entities/projects/*`).
4. **Канбан с drag&drop** для задач (`components/entities/projects/project-tasks-board.tsx`, helper `helpers/task/on-drag-end`).
5. **Спринты + бэклог** (задачи без спринта) (`prisma/schema.prisma` модель `Sprint`, `components/entities/projects/tabs/project-tabs.tsx`, `app/api/w/[workspaceId]/projects/[projectId]/sprints/*`).
6. **Аналитика проекта**: SLA, done/created vs completed, активность пользователей, распределение по статусам (`components/entities/projects/project-tasks-stats.tsx`, `app/api/charts/**`).
7. **Уведомления**: popover в dashboard layout + страница уведомлений (`components/entities/notifications/notifications-popover`, `app/(dashboard)/notifications/page.tsx`).
8. **PDF‑отчёт по задачам**: генерация на сервере (`app/api/report/pdf/route.ts`) + UI action (`src/features/reports/download-report/download-report.action.tsx`).

---

## 🧱 Архитектура

### Слои (упрощённо)

- **UI (components/)**
  - `components/entities/*` — доменные компоненты (workspaces/projects/tasks/notifications/audit)
  - `components/charts/*` — визуализация метрик
  - `components/dialogs/*` — модальные CRUD‑операции
- **Routes (app/)**
  - `app/(dashboard)/*` — server components страниц, получение данных на сервере через сервисы
  - `app/api/*` — Route Handlers, возвращают JSON/PDF
- **Business/Data layer (lib/services/)**
  - сервисы оборачивают Prisma и инкапсулируют бизнес‑логику (например, `ProjectService.getSLA`, `getWorkspaceStats`)
- **Access control (guards/, helpers/require-user.ts)**
  - серверные проверки доступа: `requireUser`, `requireWorkspaceMember`

### Где лежит бизнес-логика
- Основная серверная бизнес‑логика: `lib/services/*` (например, `lib/services/project.ts`, `lib/services/workspace.ts`).
- Проверки доступа: `helpers/require-user.ts`, `guards/workspace.ts`.
- Клиентская orchestration (табы/drag&drop/optimistic updates): `hooks/*`, `components/entities/projects/tabs/project-tabs.tsx`.

### Auth
- NextAuth конфигурация: `lib/auth.ts`
- Prisma adapter: `lib/custom-prisma-adapter.ts`
- Секрет NextAuth: `lib/next-auth-secret.ts`

> В `middleware.ts` приватные префиксы настроены как `['/settings', '/dashboard']`. При этом сами dashboard‑роуты находятся в `app/(dashboard)/*` и дают URL вида `/w/...`, `/profile`, `/notifications`. Это стоит привести к одному виду (см. Roadmap).

---

## 🛠 Технологии

- **Next.js 15**, App Router
- **React 19**, TypeScript
- **Prisma + PostgreSQL** (`prisma/schema.prisma`)
- **NextAuth** (Google/GitHub OAuth + Credentials), JWT sessions (`lib/auth.ts`)
- **TanStack React Query** для data fetching/кэша
- **TailwindCSS**
- **Radix UI** + частично **MUI**
- **Zod** + `react-hook-form`
- Charts: `recharts`, `@mui/x-charts`
- Email: **Resend**
- Payments: **CloudPayments widget** (клиент) + серверные API под платежи (детали зависят от модулей в `app/api/payment/*`)

---

## ⚙️ Запуск локально

### Требования
- Node.js (версия **не указана в коде** — не найдено `.nvmrc`/`engines` в `package.json`)
- npm (есть `package-lock.json`)
- PostgreSQL

### Установка

```bash
npm install
```

### База данных

1) Создайте БД Postgres.
2) Укажите `DATABASE_URL`.
3) Примените миграции/сгенерируйте Prisma client:

```bash
npx prisma migrate dev
```

### Запуск

```bash
npm run dev
```

### Переменные окружения (.env.local)

Ниже — **только то, что реально используется в коде**:

```env
# DB
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB

# Auth
NEXTAUTH_SECRET=replace_me

# OAuth providers (NextAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# App base URL (используется для ссылок в письмах/SSR fetch)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email
RESEND_API_KEY=...

# Middleware verify_ticket signing
APP_SECRET=replace_me
```

- `NEXTAUTH_URL` — **не найдено в коде** (встречается только в старом README). Возможно нужен NextAuth в runtime, но по коду прямых обращений нет.

---

## 📁 Структура проекта

| Путь | Назначение |
|---|---|
| `app/` | Next.js App Router: страницы, layouts, route groups |
| `app/(dashboard)/` | Dashboard UI (workspace/project/tasks/analytics) |
| `app/api/` | Backend API (Route Handlers), в т.ч. charts, report/pdf |
| `components/` | UI компоненты (entities, dialogs, charts, ui primitives) |
| `lib/services/` | Бизнес-логика и доступ к данным (Prisma) |
| `guards/` | Серверные гард-функции доступа (workspace/project) |
| `helpers/` | утилиты: requireUser, validateId, parsing, tokens |
| `hooks/` | client hooks (React Query, mutations, optimistic updates) |
| `prisma/` | schema + migrations |
| `public/` | статические ассеты (images/icons/fonts) |

---

## 🧪 Качество

- **ESLint**: `npm run lint` (конфиг `eslint.config.mjs`)
- **Prettier**: `npm run format` (`.prettierrc`, `.prettierignore`)
- **Husky + lint-staged**: есть конфиг в `package.json`
- **Typecheck**: `npm run typecheck`
- **Vitest** указан в `package.json`, но **тестовые файлы/конфиг не найдены в коде** (поиск `*.test.*`, `vitest.config.*` — пусто).

---

## 🗺 Roadmap / Что можно улучшить

1. **Си��хронизировать приватные роуты в middleware**: сейчас `matcher`/`PRIVATE_PREFIXES` используют `/dashboard`, а фактические URL dashboard — `/w/*`, `/profile`, `/notifications` (`middleware.ts`, `app/(dashboard)/*`).
2. Добавить **vitest config и реальные тесты** для критичных сценариев (auth, guards, API stats/charts) — сейчас `npm test` падает из-за отсутствия `vitest` в окружении/запуске и нет тестов в репозитории.
3. Вынести/зафиксировать **Node version** (`.nvmrc` или `engines` в `package.json`) — сейчас не найдено.
4. Добавить **документацию по платежам** (в проекте есть CloudPayments widget и payment API, но в README это должно быть описано через реальные потоки и env-переменные — сейчас не всё очевидно по коду без более глубокого аудита).
5. Добавить **скриншоты dashboard** в `public/images/screens/*` и обновить README.

---

## 📄 Лицензия

**Не найдено в коде** (файл `LICENSE` отсутствует в корне).

---

## Pitch for interview

Worknest — это система для командной работы: воркспейсы, проекты и задачи с ролями и доступами.
Главная часть — **Dashboard**, где на уровне воркспейса я показываю ключевые KPI (участники/проекты/задачи: total, in progress, done, overdue) и даю админ‑действия (инвайт, редактирование, уведомления, тариф, PDF‑отчёт).
На уровне проекта Dashboard раскрывается в 4 режима: список, канбан с drag&drop, бэклог и аналитика.
Аналитика — это набор графиков (SLA, done per day, cumulative done, created vs completed, status pie, user activity) с отдельными API‑эндпоинтами и серверной агрегацией.
Архитектурно это Next.js App Router + Prisma/Postgres, сервисный слой `lib/services/*`, guards для авторизации, и React Query на клиенте для кеша/мутаций.
В интервью я бы показал `app/(dashboard)/w/[workspaceId]/page.tsx` и `components/entities/projects/tabs/project-tabs.tsx` как центральные точки dashboard-UX.
