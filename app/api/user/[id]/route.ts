import { requireUser } from '@/helpers/require-user';
import { ok, serverError } from '@/lib/http';
import { UserService } from '@/lib/services/user';

export async function GET(context: { params: { id: string } }) {
  try {
    await requireUser();

    const user = await UserService.getUserProfile(context.params.id);
    return ok(user);
  } catch (e) {
    console.error(e);
    return serverError('Failed to get user');
  }
}
