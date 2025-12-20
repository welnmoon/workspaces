import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth/next';
import {
  badRequest,
  conflict,
  serverError,
  unprocessable,
} from '@/lib/http/http';
import { resend } from '@/lib/email/resend-client';
import { registerSchema } from '@/components/forms/register/register-schema';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { UserService } from '@/lib/services/user';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

// sign up - это регистрация

// после успешной регистраии на клиенте делаем - await signIn("credentials", { email, password, callbackUrl: "/dashboard" });

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (session)
      return badRequest('User already logged in', 'USER_ALREADY_LOGGED_IN');

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return unprocessable(parsed.error.message, parsed.error.flatten());
    }
    const firstName = parsed.data.firstName?.trim();
    const lastName = parsed.data.lastName?.trim();
    const email = parsed.data.email?.trim().toLowerCase();
    const password = parsed.data.password;
    if (!email || !firstName || !lastName || !password) {
      return badRequest('Missing required fields');
    }

    const user = await prisma.user.findUnique({ where: { email } });


    if (user?.emailVerified) {
      return conflict('User already exists', 'USER_ALREADY_EXISTS');
    }

    const rawToken = crypto.randomBytes(32).toString('hex'); // url-safe
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.$transaction(async (tx) => {
        const client = tx as typeof prisma;

        if (!user) {
          await client.user.create({
            data: { email, firstName, lastName, password: hashedPassword },
          });
        } else {
          await client.user.update({
            where: { email },
            data: { firstName, lastName, password: hashedPassword },
          });
        }

        await client.verificationToken.deleteMany({
          where: { identifier: email },
        });
        await client.verificationToken.create({
          data: { identifier: email, token: tokenHash, expires: expiresAt },
        });
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const e = err as Prisma.PrismaClientKnownRequestError;

        if (e.code === 'P2002') {
          return conflict('User already exists', 'USER_ALREADY_EXISTS');
        }
      }

      throw err;
    }

    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${rawToken}`;
    await resend.emails.send({
      from: 'MyApp <onboarding@resend.dev>',
      to: email,
      subject: 'Подтверждение регистрации',
      html: `<p>Привет, ${firstName} ${lastName}! Пожалуйста, подтвердите свой email: <a href="${verifyLink}">Подтвердить</a></p>`,
    });

    // Пока resend платный и не позволяет отправлять на почты с других доменов
    // Поэтому временно для пет проекта сразу будем верифицировать
    // TODO delete this
    await UserService.verifyUser(email);

    return NextResponse.json(
      {
        message:
          'Если адрес существует, мы отправили письмо для подтверждения.',
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return serverError('Failed to register user');
  }
}
