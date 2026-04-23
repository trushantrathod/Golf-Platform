import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27-preview' as any,
});

// We use the Service Role key here to bypass RLS safely on the server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // This verifies the call is actually from Stripe, not a hacker
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // If the payment was successful...
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId; // We passed this in the checkout step!

    if (userId) {
      // Tell Supabase to make them an active subscriber!
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ subscription_active: true })
        .eq('id', userId);

      if (error) console.error("Error updating subscription:", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}