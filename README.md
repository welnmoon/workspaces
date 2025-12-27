# Worknest

Платформа для командной работы: **воркспейсы → проекты → задачи**  
с ролями, уведомлениями и аналитикой.

Ключевая ценность — **Dashboard** как центр управления командой и метриками.

---

## Содержание

- [О проекте](#о-проекте)
- [Ключевая ценность](#ключевая-ценность)
- [Функциональность](#функциональность)
- [Dashboard](#dashboard)
  - [Workspace Dashboard](#workspace-dashboard)
  - [Project Dashboard](#project-dashboard)
  - [Аналитика проекта](#аналитика-проекта)
- [Архитектура](#архитектура)
  - [Поток данных](#поток-данных)
  - [Слои приложения](#слои-приложения)
- [Технологический стек](#технологический-стек)
- [Запуск локально](#запуск-локально)
- [Переменные окружения](#переменные-окружения)
- [Структура проекта](#структура-проекта)
- [Качество кода](#качество-кода)
- [Roadmap](#roadmap)
- [Pitch for interview](#pitch-for-interview)

---

## О проекте

**Worknest** — SaaS-платформа для командной работы, построенная вокруг иерархии:

**Workspace → Projects → Tasks**

Проект реализует типовые сценарии продуктовой команды:

- управление задачами,
- контроль прогресса,
- аналитика эффективности,
- роли и доступы,
- админ-действия внутри workspace.

Проект разрабатывался как **production-ready pet-project**  
с фокусом на архитектуру, масштабируемость и UX dashboard-ов.

---

## Ключевая ценность

Основная идея — **Dashboard-ориентированный подход**:

- на уровне workspace — агрегированные KPI по команде и задачам,
- на уровне проекта — операционное управление + аналитика,
- минимум переходов между действиями и метриками.

Фокус не на CRUD, а на:

- серверной агрегации данных,
- визуализации метрик,
- управлении доступами,
- реальных админ-сценариях SaaS-продукта.

---

## Функциональность

- Мульти-воркспейсы
- Роли: **OWNER / ADMIN / MEMBER**
- Проекты с жизненным циклом (active / archived)
- Задачи со статусами и приоритетами
- Канбан с drag & drop
- Спринты и бэклог
- Аналитика по задачам и активности
- Уведомления
- PDF-отчёты
- Платные тарифы (billing)

---

## Dashboard

Dashboard — защищённая зона приложения (`app/(dashboard)/*`),  
где пользователь управляет всей работой команды.

---

## Workspace Dashboard

Workspace Dashboard показывает агрегированное состояние воркспейса.

### Метрики

- количество участников
- количество проектов
- задачи:
  - всего
  - в работе
  - выполнено
  - TODO
  - просроченные

### Дополнительно

- роль пользователя в воркспейсе
- текущий тариф
- доступ к журналу аудита
- админ-действия (для OWNER / ADMIN)

### Скриншот

📸 `public/images/screens/workspace-dashboard.png`

---

## Project Dashboard

Project Dashboard — основное рабочее место внутри проекта.

### Режимы работы

1. Список задач (по спринтам)
2. Канбан (drag & drop)
3. Бэклог
4. Аналитика

### Скриншот

📸 `public/images/screens/project-dashboard.png`

---

## Аналитика проекта

Аналитика строится на серверных агрегатах и отдельных API-эндпоинтах.

### Доступные графики

- SLA (% задач, закрытых в срок)
- Created vs Completed
- Cumulative Done
- Done per Day
- Tasks by Status (pie)
- User Activity

Каждый график:

- имеет собственный API-route,
- получает агрегированные данные с сервера,
- изолирован как отдельный компонент.

### Скриншоты

📸 `public/images/screens/project-analytics-1.png`  
📸 `public/images/screens/project-analytics-2.png`

---

## Архитектура

### Поток данных

Client (React, Next.js App Router)
↓
TanStack React Query (cache, mutations)
↓
API Routes (Next.js Route Handlers, Node.js runtime)
↓
Service Layer (business logic, Node.js)
↓
Prisma ORM
↓
PostgreSQL

---

### Слои приложения

- UI
  - domain-components (workspaces / projects / tasks)
  - charts
  - dialogs
- API
  - Next.js Route Handlers
- Business logic
  - `lib/services/*`
- Access control
  - server guards
- Data
  - Prisma + PostgreSQL

Бизнес-логика не хранится в UI и не дублируется на клиенте.

---

## Технологический стек

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Radix UI
- shadcn/ui
- TanStack React Query
- React hook Form + Zod

### Backend

- Next.js Route Handlers (Node.js runtime)
- Prisma ORM
- PostgreSQL

### Интеграции

- NextAuth (OAuth + Credentials)
- Resend (email)
- CloudPayments (billing)
- Charts: recharts, @mui/x-charts

---

## Запуск локально

### Установка

npm install

### База данных

npx prisma migrate dev

### Запуск

npm run dev

---

## Переменные окружения

DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB  
NEXTAUTH_SECRET=replace_me

GOOGLE_CLIENT_ID=...  
GOOGLE_CLIENT_SECRET=...

GITHUB_CLIENT_ID=...  
GITHUB_CLIENT_SECRET=...

RESEND_API_KEY=...

NEXT_PUBLIC_BASE_URL=http://localhost:3000  
APP_SECRET=replace_me

---

## Структура проекта

app/ # Pages + API routes  
components/ # UI и domain components  
features/ # Business actions  
lib/services/ # Business logic  
guards/ # Access control  
hooks/ # Client hooks  
prisma/ # Schema & migrations  
public/ # Static assets

---

## Качество кода

- ESLint
- Prettier
- Husky + lint-staged
- TypeScript (strict)

---

## Roadmap

- Исправить post-payment flow: обновление тарифа пользователя после успешной оплаты
- Провести рефакторинг структуры проекта (feature-based архитектура)
- Добавить unit и integration тесты для сервисного слоя и API-роутов (Vitest)
- Улучшить синхронизацию данных между пользователями (polling / real-time)
- Улучшить обработку edge-cases (удалённые сущности, устаревшие данные, UX для 403/404)
- Зафиксировать Node.js version (`.nvmrc` или `engines`)
- Документировать billing-флоу и жизненный цикл тарифа
- Добавить базовое серверное логирование и audit-логи

---

