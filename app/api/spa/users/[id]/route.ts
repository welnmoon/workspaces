import { withCors } from '@/helpers/with-cors';
import { noContent, ok, serverError } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // await requireUser();
    const id = (await params).id;
    const user = await UserService.getUserById(id);
    const res = ok(user);
    res.headers.set('Access-Control-Allow-Origin', process.env.VITE_URL!);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Vary', 'Origin');
    return res;
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to update user'));
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // await requireUser();
    const id = (await params).id;
    const user = await req.json();
    const updatedUser = await UserService.updateUser(id, user);
    const res = ok(updatedUser);
    // res.headers.set('Access-Control-Allow-Origin', process.env.VITE_URL!);
    // res.headers.set('Access-Control-Allow-Credentials', 'true');
    // res.headers.set('Vary', 'Origin');
    return withCors(res);
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to update user'));
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // await requireUser();
    const id = (await params).id;
    await UserService.deleteUser(id);
    return withCors(noContent());
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to delete user'));
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.VITE_URL!,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      Vary: 'Origin',
    },
  });
}
