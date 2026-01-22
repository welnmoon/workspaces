import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.APP_SECRET!);

const AUTH_PAGES = ['/login', '/register', '/not-auth'];

const PRIVATE_PREFIXES = ['/settings', '/dashboard'];

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl;
    const path = url.pathname;
    const isAuthPage = AUTH_PAGES.includes(path);
    const isLoggedIn =
      !!req.nextauth.token && req.nextauth.token.userExists !== false;

    if (path === '/verify/success') {
      const token = req.cookies.get('verify_ticket')?.value;
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      try {
        await jwtVerify(token, SECRET);

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

    return NextResponse.next();
  },
  {
    pages: { signIn: '/login' },

    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (AUTH_PAGES.includes(path)) return true;
        if (PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix))) {
          return !!token && token.userExists !== false;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/not-auth',
  ],
};
