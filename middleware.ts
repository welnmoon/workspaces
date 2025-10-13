// middleware.ts
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Страницы аутентификации (их не показываем авторизованным)
const AUTH_PAGES = ['/login', '/register', '/not-auth'];

// Приватные разделы (пускаем только с токеном)
const PRIVATE_PREFIXES = ['/profile', '/settings', '/dashboard'];
// Если есть админка — раскомментируй:
// const ADMIN_PREFIX = "/admin"

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    const path = url.pathname;
    const isAuthPage = AUTH_PAGES.includes(path);
    const isLoggedIn = !!req.nextauth.token;

    // 1) Авторизован — не показываем /login /register /not-auth
    if (isLoggedIn && isAuthPage) {
      url.pathname = '/profile'; // куда отправлять авторизованных с auth-страниц
      return NextResponse.redirect(url);
    }

    // 2) Иначе просто пропускаем
    return NextResponse.next();
  },
  {
    // Куда слать НЕавторизованных, если они лезут в приватные разделы
    pages: { signIn: '/login' }, // кидает на адрес /login?callbackUrl=/profile

    // Главный фильтр допуска
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // На /login /register /not-auth пускаем всех
        if (AUTH_PAGES.includes(path)) return true;

        // На приватные разделы — только с токеном
        if (PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix))) {
          return !!token; // есть токен -> пускаем
        }

        // Пример ролевой защиты админки (раскомментируй при необходимости):
        // if (path.startsWith(ADMIN_PREFIX)) {
        //   return !!token && (token as any).role === "admin"
        // }

        // Остальные пути — не контролируем данным middleware
        return true;
      },
    },
  }
);

// К каким путям применять middleware (остальные игнорируются)
export const config = {
  matcher: [
    // приватные разделы
    '/profile/:path*',
    '/settings/:path*',
    '/dashboard/:path*',
    // "/admin/:path*", // раскомментируй, если используешь админку

    // контролируем auth-страницы (чтобы не показывать их авторизованным)
    '/login',
    '/register',
    '/not-auth',
  ],
};
