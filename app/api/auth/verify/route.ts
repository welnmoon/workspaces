import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { fail } from '@/lib/http';
import { SignJWT } from 'jose';
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = new URL(req.url);
    const rawToken = searchParams.get('token');

    if (!rawToken) throw new AppError(400, 'INVALID_TOKEN', 'Нет токена');

    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex'); // TODO - helper

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: tokenHash,
      },
    });

    if (!verificationToken) return fail('invalid', url);

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.deleteMany({
        where: {
          token: tokenHash,
        },
      });
      return fail('expired', url);
    }

    const email = verificationToken.identifier;

    await prisma.$transaction(async (tx) => {
      const client = tx as typeof prisma;

      await client.verificationToken.deleteMany({
        where: {
          token: tokenHash,
        },
      });

      await client.user.update({
        where: {
          email,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    });

    const ticket = await new SignJWT({ purpose: 'verify_success' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2m')
      .sign(SECRET);

    const res = NextResponse.redirect(new URL('/verify/success', url), 302);

    res.cookies.set('verify_ticket', ticket, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/verify',
      maxAge: 120, // сек
    });

    return res;
  } catch (e) {
    console.error(e);
    return fail('invalid');
  }
}
