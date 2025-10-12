import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// login - TODO - Delete this route
export async function GET(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.password) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  return NextResponse.json({
    id: String(user.id),
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
    image: user.image,
  });
}
