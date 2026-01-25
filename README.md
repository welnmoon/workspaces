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
- [SPA (Vite)](#spa-vite)
- [Admin API (/api/spa)](#admin-api-apispa)
- [Деплой (Vercel)](#деплой-vercel)
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

<img width="1917" height="902" alt="image" src="https://github.com/user-attachments/assets/7b490926-f7f5-4623-b2c7-f95b5ec464d7" />


---

## Project Dashboard

Project Dashboard — основное рабочее место внутри проекта.

### Режимы работы

1. Список задач (по спринтам)
2. Канбан (drag & drop)
3. Бэклог
4. Аналитика

### Скриншот

<img width="1902" height="910" alt="image" src="https://github.com/user-attachments/assets/e152a325-a5f6-4552-9509-58cff17efa1f" />
<img width="1620" height="745" alt="image" src="https://github.com/user-attachments/assets/c44fc0e2-6af1-4f7e-a243-0c668acfedfa" />


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

<img width="1589" height="464" alt="image" src="https://github.com/user-attachments/assets/b5532cf4-f9ce-4828-80ab-c88d87f256b4" />

<img width="1590" height="516" alt="image" src="https://github.com/user-attachments/assets/a062eaae-e58d-4956-901b-6d5fb16cb6f2" />


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

### Admin SPA (Vite)

- Vite + React Router
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- TailwindCSS + Radix UI

---

## Запуск локально

### Установка

npm install

### База данных

npx prisma migrate dev

### Запуск

npm run dev

---

## SPA (Vite)

SPA находится в `spa/` и используется как административная панель Worknest
(отдельное приложение на Vite + React Router + Redux Toolkit/RTK Query).

### Что есть сейчас

- Пользователи: список, редактирование профиля, удаление.
- Воркспейсы: список, редактирование, удаление.
- Проекты: список, удаление (страницы редактирования пока нет).
- Задачи и спринты: разделы в интерфейсе помечены как "в разработке".

### Доступ

- Перед входом проверяется сессия через `/api/spa/me`.
- Доступ разрешён только `platformRole = SYSADMIN`.
- Иначе редирект на `/login` основного приложения с `reason` и `from`.
- Для локальной работы нужна активная сессия NextAuth (cookie) из основного приложения.

### Настройка API

- Используется `VITE_API_ORIGIN` из `spa/.env`.
- RTK Query baseUrl: `${VITE_API_ORIGIN}/api/spa`, запросы идут с `credentials: "include"`.

### Локальный запуск SPA

npm --prefix spa install  
npm --prefix spa run dev

---

## Admin API (/api/spa)

Маршруты `app/api/spa/*` обслуживают админ-панель и защищены проверкой роли.

### Доступ и безопасность

- На всех эндпоинтах используется `requirePlatformRole([SYSADMIN])`.
- Поддержан CORS; SPA делает запросы с `credentials: "include"`.

### Основные эндпоинты

- `GET /api/spa/me`
- `GET /api/spa/users`, `GET/PUT/DELETE /api/spa/users/:id`
- `GET /api/spa/workspaces`, `GET/PUT/DELETE /api/spa/workspaces/:id`
- `GET /api/spa/projects`, `GET/PUT/DELETE /api/spa/projects/:id`
- `GET /api/spa/tasks`, `GET/PUT/DELETE /api/spa/tasks/:id`
- `GET /api/spa/sprints`, `GET/PUT/DELETE /api/spa/sprints/:id`

---

## Деплой (Vercel)

Деплой разделён на два проекта:

- **Next app**: корень репозитория, работает на `https://workspaces-phi.vercel.app`.
- **SPA app**: root directory `spa`, билд `npm run build`, output `dist`,
  работает на `https://workspaces-nyvc.vercel.app`.

SPA обращается к API Next через `VITE_API_ORIGIN` (см. `spa/.env`),
итоговый baseUrl: `${VITE_API_ORIGIN}/api/spa`.

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

VITE_API_ORIGIN=http://localhost:3000 # SPA (spa/.env)

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
spa/ # Admin SPA (Vite)

---

## Качество кода

- ESLint
- Prettier
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
