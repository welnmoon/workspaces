import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// sign up - это регистрация

// после успешной регистраии на клиенте делаем - await signIn("credentials", { email, password, callbackUrl: "/dashboard" });

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, password } = await req.json();

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
    return NextResponse.json(
      { error: 'Пользователь уже существует' },
      { status: 409 }
    ); // 409 - конфликт,
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, firstName, lastName, password: hashed },
  });

  return NextResponse.json(
    { message: 'User created successfully' },
    { status: 201 }
  );
}
