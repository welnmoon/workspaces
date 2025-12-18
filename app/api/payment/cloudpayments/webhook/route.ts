import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Tariff } from '@prisma/client';
import { UserService } from '@/lib/services/user';

const SECRET = process.env.CLOUD_PAYMENTS_SECRET;

export async function POST(req: NextRequest) {
  if (!SECRET) {
    console.error('payment webhook: missing CLOUD_PAYMENTS_SECRET');
    return NextResponse.json(
      { error: 'server misconfigured' },
      { status: 500 }
    );
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
    const jsonDataRaw =
      data.JsonData ??
      data.jsonData ??
      data.Data?.JsonData ??
      data.Data?.jsonData ??
      null;
    const jsonData =
      typeof jsonDataRaw === 'string'
        ? JSON.parse(jsonDataRaw)
        : jsonDataRaw ?? data.Data ?? {};

    const accountId =
      data.AccountId ??
      data.accountId ??
      data.Data?.AccountId ??
      data.Data?.accountId ??
      null;

    let userId = String(jsonData?.userId ?? '');
    const tariffRaw = jsonData?.tariff ?? data.Data?.tariff;
    const tariffStr =
      typeof tariffRaw === 'string' ? tariffRaw : String(tariffRaw);

    if (!userId && accountId) {
      const user = await UserService.getUserByEmail(String(accountId));
      userId = user?.id ?? '';
    }

    if (!userId || !tariffStr) {
      console.warn('payment webhook: missing userId or tariff', {
        userId,
        accountId,
        tariffStr,
      });
      return NextResponse.json({ error: 'missing data' }, { status: 400 });
    }

    // runtime-список допустимых тарифов из Prisma enum
    const allowedTariffs = Object.values(Tariff) as string[];

    if (!allowedTariffs.includes(tariffStr)) {
      console.warn(
        'payment webhook: invalid tariff value',
        tariffStr,
        'allowed:',
        allowedTariffs
      );
      return NextResponse.json({ error: 'invalid tariff' }, { status: 400 });
    }

    // безопасно приводим к типу Tariff
    await UserService.updateUserTariff(userId, tariffStr as Tariff);
  }

  return new Response('OK', { status: 200 });
}
