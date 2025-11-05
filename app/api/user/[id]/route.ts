import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http';
import { UserService } from '@/lib/services/user';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id;
    await requireUser();
    const user = await UserService.getUserProfile(id);
    return ok(user);
  } catch (e) {
    console.error(e);
    return serverError('Failed to get user');
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireUser();
    const updated = await UserService.updateUser(params.id, await req.json());
    return ok(updated);
  } catch (e) {
    console.error(e);
    return serverError('Failed to update user');
  }
}
