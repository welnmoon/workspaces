// import { authOptions } from '@/lib/auth';
// import {
//   created,
//   forbidden,
//   noContent,
//   notFound,
//   unauthorized,
//   unprocessable,
// } from '@/lib/http';
// import { WorkspaceService } from '@/lib/services/workspace';
// import { paymentSchema } from '@/schemas/workspace/payment-schema';
// import { getServerSession } from 'next-auth';
// import { NextRequest, NextResponse } from 'next/server';

// // update workspace with tariff
// export async function PATCH(
//   _req: NextRequest,
//   { params }: { params: Promise<{ workspaceId: string }> }
// ) {
//   const user = await getServerSession(authOptions);
//   if (!user) {
//     return unauthorized('Вы не авторизованы');
//   }
//   const wId = Number((await params).workspaceId);

//   const w = await WorkspaceService.getWorkspaceById(wId);

//   if (!w) {
//     return notFound('Пространство не найдено');
//   }

//   if (w.ownerId !== user.user.id) {
//     return forbidden('Вы не являетесь владельцем пространства');
//   }

//   const data = await _req.json();
//   const result = paymentSchema.safeParse(data);

//   if (!result.success) {
//     return unprocessable(result.error.message, result.error.flatten());
//   }

//   await WorkspaceService.updateWorkspaceTariff(wId, result.data.name);

//   return noContent();
// }
