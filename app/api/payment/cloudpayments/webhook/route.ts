import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { WorkspaceService } from '@/lib/services/workspace';
import { TariffDTO } from '@/types/prisma/DTO/payment';

const SECRET = process.env.CLOUD_PAYMENTS_SECRET;

export async function POST(req: NextRequest) {
  if (!SECRET) {
    console.error('payment webhook: missing CLOUD_PAYMENTS_SECRET');
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('Content-HMAC');
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(body)
    .digest('base64');

  const provided = signature ? Buffer.from(signature) : null;
  const expected = Buffer.from(expectedSignature);
  const isValidSignature =
    !!provided &&
    provided.length === expected.length &&
    crypto.timingSafeEqual(provided, expected);

  if (!isValidSignature) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const data = JSON.parse(body);
  console.log('payment webhook', data);

  const status = data.status ?? data.Status;
  if (status === 'Completed') {
    // Кастомные данные, которые отправили из виджета, приходят в jsonData/Data
    const wId = Number(data.jsonData?.workspaceId ?? data.Data?.workspaceId);
    const tariff = data.jsonData?.tariff ?? data.Data?.tariff;

    console.log('payment webhook', wId, tariff);

    if (!wId || !tariff) {
      console.warn('payment webhook: missing workspaceId or tariff', data);
      return NextResponse.json({ error: 'missing data' }, { status: 400 });
    }

    await WorkspaceService.updateWorkspaceTariff(wId, tariff as TariffDTO);
  }

  return new Response('OK', { status: 200 });
}
