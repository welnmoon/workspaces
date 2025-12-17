import { requireUser } from '@/helpers/require-user';
import { forbidden, ok, serverError } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const requestedId = (await params).id;
    const user = await requireUser();

    if (user.id !== requestedId) {
      return forbidden('Недостаточно прав');
    }

    const payments = await UserService.getUserPayments(requestedId);
    return ok(payments);
  } catch (e) {
    console.error(e);
    return serverError('Failed to get payments');
  }
}

