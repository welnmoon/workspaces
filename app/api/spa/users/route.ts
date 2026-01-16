import { ok, serverError } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // await requireUser();
    const users = await UserService.getUsers();
    const res = ok(users);
    res.headers.set('Access-Control-Allow-Origin', process.env.SPA_URL!);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Vary', 'Origin');
    return res;
  } catch (e) {
    console.error(e);
    return serverError('Failed to get users');
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.SPA_URL!,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });
}
