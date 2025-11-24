import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { WorkspaceService } from '@/lib/services/workspace';

const SECRET = process.env.CLOUD_PAYMENTS_SECRET!;
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('HMAC-SHA256');

  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(body);
  if (hmac.digest('hex') !== signature)
    return NextResponse.json({ error: 'invalid signature' });

  const data = JSON.parse(body);

  if (data.event === 'check' || data.event === 'pay') {
    if (data.status === 'Completed') {
      const email = data.accountId;
      const invoiceId = data.invoiceId;
      const wId: number = data.workspaceId;

      const tariff = invoiceId.startsWith('pro-') ? 'PRO' : 'BUSINESS';

      // Находим пользователя и меняем тариф
      await WorkspaceService.updateWorkspaceTariff(wId, tariff);
    }
  }

  return new Response('OK', { status: 200 });
}
