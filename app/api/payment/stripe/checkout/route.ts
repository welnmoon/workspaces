import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId, userId } = (await req.json()) as {
    priceId: string; // 
    userId: string; // твой id пользователя из базы/авторизации
  };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
    // чтобы в вебхуке ты точно понимал, кому выдать тариф:
    client_reference_id: userId,
    // можно ещё metadata, если надо
  });

  return Response.json({ url: session.url });
}
