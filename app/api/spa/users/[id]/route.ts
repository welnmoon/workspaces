import { corsHeaders, withCors } from '@/helpers/with-cors';
import { noContent, ok, serverError } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
                           
    const id = (await params).id;
    const user = await UserService.getUserById(id);
    const res = ok(user);
    return withCors(res, _req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(
      serverError('Failed to update user'),
      _req.headers.get('origin')
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
                           
    const id = (await params).id;
    const user = await req.json();
    const updatedUser = await UserService.updateUser(id, user);
    const res = ok(updatedUser);
    return withCors(res, req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to update user'), req.headers.get('origin'));
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
                           
    const id = (await params).id;
    await UserService.deleteUser(id);
    return withCors(noContent(), _req.headers.get('origin'));
  } catch (e) {
    console.error(e);
    return withCors(serverError('Failed to delete user'), _req.headers.get('origin'));
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(req.headers.get('origin')),
      'Access-Control-Allow-Methods': 'GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}
