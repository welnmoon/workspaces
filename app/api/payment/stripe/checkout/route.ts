import { TariffKey } from '@/const/tariffs';
import { requireUser } from '@/helpers/require-user';
import { badRequest } from '@/lib/http/http';
import { STRIPE_PLANS } from '@/lib/payments/stripe-plans';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
type Props = {
  tariff: TariffKey;
};
export async function POST(req: Request) {
  const { tariff } = (await req.json()) as Props;
  const { id: userId } = await requireUser();

  if (tariff === 'FREE') {
    return badRequest('Нельзя оформить подписку на бесплатный тариф');
  }

  const priceId = STRIPE_PLANS[tariff].priceId;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
                                                           
    client_reference_id: userId,
                                    
  });

  return Response.json({ url: session.url });
}
