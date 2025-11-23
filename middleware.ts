// middleware.ts
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.APP_SECRET!);

// Страницы аутентификации (их не показываем авторизованным)
const AUTH_PAGES = ['/login', '/register', '/not-auth'];

// Приватные разделы (пускаем только с токеном)
const PRIVATE_PREFIXES = ['/settings', '/dashboard'];
// Если есть админка — раскомментируй:
// const ADMIN_PREFIX = "/admin"

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl;
    const path = url.pathname;
    const isAuthPage = AUTH_PAGES.includes(path);
    const isLoggedIn =
      !!req.nextauth.token && (req.nextauth.token as any).userExists !== false;

    if (path === '/verify/success') {
      const token = req.cookies.get('verify_ticket')?.value;
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      try {
        await jwtVerify(token, SECRET); // проверка подписи/срока
        // Пропускаем и сразу очищаем билет (одноразовость)
        const res = NextResponse.next();
        res.cookies.set('verify_ticket', '', {
          path: '/verify',
          maxAge: 0,
        });
        return res;
      } catch {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // 1) Авторизован — не показываем /login /register /not-auth
    // Отключено, чтобы не было циклов редиректов при удалённых/некорректных сессиях
    // if (isLoggedIn && isAuthPage) {
    //   url.pathname = '/profile'; // куда отправлять авторизованных с auth-страниц
    //   return NextResponse.redirect(url);
    // }

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
          return !!token && (token as any).userExists !== false; // есть токен и пользователь существует -> пускаем
        }

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
