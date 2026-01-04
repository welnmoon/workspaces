import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/http/handle-api-error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = (await headers()).get('stripe-signature');
  const rawBody = await req.text(); // важно: именно text(), не json()

  if (!sig) {
    return new Response('Missing stripe-signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    return handleApiError(err);
  }

  // Обрабатывай нужные события
  switch (event.type) {
    case 'checkout.session.completed': {
      const _session = event.data.object as Stripe.Checkout.Session;
      // TODO: выдай доступ/тариф пользователю по session.customer или session.client_reference_id
      break;
    }
    case 'invoice.paid': {
      const _invoice = event.data.object as Stripe.Invoice;
      // TODO: продли/подтверди подписку
      break;
    }
    case 'invoice.payment_failed': {
      const _invoice = event.data.object as Stripe.Invoice;
      // TODO: пометь как "не оплачен", отправь уведомление
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const _sub = event.data.object as Stripe.Subscription;
      // TODO: обнови статус тарифа в базе
      break;
    }
    default:
      // игнор
      break;
  }

  return new Response('ok', { status: 200 });
}
