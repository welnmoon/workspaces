import { requireUser } from '@/helpers/require-user';
import { AppError } from '@/lib/errors';
import {
  badRequest,
  forbidden,
  noContent,
  notFound,
  serverError,
  unauthorized,
  unprocessable,
} from '@/lib/http/http';
import { WorkspaceService } from '@/lib/services/workspace';
import { paymentSchema } from '@/schemas/workspace/payment-schema';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ workspaceId: string }> };

// PATCH /api/w/:workspaceId/payment
// Manual tariff update (fallback to webhook)
// export async function PATCH(req: NextRequest, { params }: Params) {
//   try {
//     const { id } = await requireUser();
//     const workspaceId = Number((await params).workspaceId);
//     if (Number.isNaN(workspaceId)) {
//       return badRequest('Некорректный идентификатор рабочего пространства');
//     }

//     const workspace = await WorkspaceService.getWorkspaceById(workspaceId);
//     if (!workspace) return notFound('Пространство не найдено');
//     if (workspace.ownerId !== id)
//       return forbidden('Вы не являетесь владельцем пространства');

//     const body = await req.json().catch(() => null);
//     if (!body) return unprocessable('Некорректный JSON');

//     const parsed = paymentSchema.safeParse(body);
//     if (!parsed.success) {
//       return unprocessable(parsed.error.message, parsed.error.flatten());
//     }

//     await WorkspaceService.updateWorkspaceTariff(workspaceId, parsed.data.name);
//     return noContent();
//   } catch (e) {
//     if (e instanceof AppError) return unauthorized('Вы не авторизованы');
//     console.error('payment update error', e);
//     return serverError('Не удалось обновить тариф');
//   }
// }
