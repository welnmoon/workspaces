import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireUser } from '@/helpers/require-user';
import { conflict, ok, serverError, unprocessable } from '@/lib/http';
import { resend } from '@/lib/email/resend-client';
import { registerSchema } from '@/components/forms/register/register-schema';
import crypto from 'crypto';

// sign up - это регистрация

// после успешной регистраии на клиенте делаем - await signIn("credentials", { email, password, callbackUrl: "/dashboard" });

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return unprocessable(result.error.message, result.error.flatten());
    }
    const { email, firstName, lastName, password } = result.data;

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const session = await getServerSession(authOptions);

    if (session) {
      return NextResponse.json(
        { error: 'User already logged in' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return conflict('User already exists'); // 409
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString('hex'); // сырой токен - не зашифрованный
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${rawToken}`;

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: { email, firstName, lastName, password: hashedPassword },
      });

      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: tokenHash,
          expires: expiresAt,
        },
      });
      // verification email
      await resend.emails.send({
        from: 'MyApp <onboarding@resend.dev>',
        to: email,
        subject: 'Подтверждение регистрации',
        html: `<p>Привет, ${firstName} ${lastName}! Пожалуйста, подтвердите свой email: <a href="${verifyLink}">Подтвердить</a></p>`,
      });
    });

    return ok('Пользователь зарегистрирован', { status: 201 });
  } catch (e) {
    console.error(e);
    return serverError('Failed to register user');
  }
}
