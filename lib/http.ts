import { NextResponse } from 'next/server';

/**
 * ✅ 200 OK — успешный ответ с данными
 * Используй для обычных GET, PATCH, PUT, когда операция прошла успешно.
 */
export function ok<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(
    { data },
    typeof init === 'number' ? { status: init } : init
  );
}

/**
 * ✅ 201 Created — ресурс успешно создан
 * Используй для POST (создание записи, проекта, задачи, и т.д.)
 * location — путь к созданному ресурсу, например "/api/workspaces/1"
 */
export const created = <T>(data: T, location?: string) => {
  const res = NextResponse.json({ data }, { status: 201 });
  if (location) res.headers.set('Location', location);
  return res;
};

/**
 * ⚙️ 204 No Content — успешный ответ без тела
 * Используй для DELETE (удаление записи), либо для PATCH без возвращаемых данных.
 */
export function noContent() {
  return new NextResponse(null, { status: 204 });
}

/**
 * ⚠️ 400 Bad Request — ошибка на стороне клиента
 * Используй, если запрос неправильно сформирован, отсутствует обязательное поле,
 * или тело запроса невозможно прочитать.
 */
export function badRequest(message = 'Bad Request', details?: unknown) {
  return NextResponse.json({ message, details }, { status: 400 });
}

/**
 * 🚫 401 Unauthorized — нет токена или пользователь не вошёл в систему
 * Используй, если requireUser() не возвращает пользователя.
 */
export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 });
}

/**
 * ⛔ 403 Forbidden — нет прав на действие
 * Используй, если пользователь вошёл, но не имеет нужной роли (например, не OWNER).
 */
export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ message }, { status: 403 });
}

/**
 * 🔍 404 Not Found — ресурс не найден
 * Используй, если объект по ID не существует (например, проект, воркспейс и т.п.)
 */
export function notFound(message = 'Not Found') {
  return NextResponse.json({ message }, { status: 404 });
}

/**
 * ⚔️ 409 Conflict — конфликт состояния
 * Используй, если уже существует запись (например, уникальное имя, e-mail и т.п.)
 */
export function conflict(message = 'Conflict', code?: string) {
  return NextResponse.json({ code, message }, { status: 409 });
}

/**
 * 🚧 422 Unprocessable Entity — валидация не прошла (Zod, JOI и т.п.)
 * Используй, если данные валидны по JSON, но не по бизнес-правилам.
 */
export function unprocessable(
  message = 'Validation failed',
  details?: unknown
) {
  return NextResponse.json({ message, details }, { status: 422 });
}

/**
 * ⏳ 429 Too Many Requests — превышен лимит запросов
 * Используй, если у тебя rate limit (например, защита API от спама).
 */
export function tooManyRequests(message = 'Too Many Requests') {
  return NextResponse.json({ message }, { status: 429 });
}

/**
 * 💥 500 Internal Server Error — внутренняя ошибка сервера
 * Используй, если что-то пошло не так внутри try/catch (например, Prisma error)
 */
export function serverError(
  message = 'Internal Server Error',
  details?: unknown
) {
  return NextResponse.json({ message, details }, { status: 500 });
}

/**
 * 🚫 501 Not Implemented — метод пока не реализован
 * Иногда удобно для заглушек.
 */
export function notImplemented(message = 'Not Implemented') {
  return NextResponse.json({ message }, { status: 501 });
}

/**
 * 🧭 405 Method Not Allowed — метод не поддерживается для этого маршрута
 * Например, пользователь отправил POST на endpoint, где разрешён только GET.
 */
export function methodNotAllowed(allowed: string[]) {
  const res = NextResponse.json(
    { message: `Method not allowed. Use: ${allowed.join(', ')}` },
    { status: 405 }
  );
  res.headers.set('Allow', allowed.join(', '));
  return res;
}
