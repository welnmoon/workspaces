import { requireUser } from '@/helpers/require-user';
import { handleApiError } from '@/lib/http/handle-api-error';
import { forbidden, noContent, unprocessable } from '@/lib/http/http';
import { UserService } from '@/lib/services/user';
import { paymentSchema } from '@/schemas/workspace/payment-schema';
import { NextRequest } from 'next/server';

// PATCH /api/user/:id/payment
// Manual tariff update (fallback to webhook)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const requestedId = (await params).id;

    if (user.id !== requestedId) {
      return forbidden('Недостаточно прав');
    }

    const body = await req.json().catch(() => null);
    if (!body) return unprocessable('Некорректный JSON');

    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return unprocessable(parsed.error.message, parsed.error.flatten());
    }

    await UserService.updateUserTariff(requestedId, parsed.data.name);
    return noContent();
  } catch (e) {
    return handleApiError(e);
  }
}
