import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, { apiVersion: '2024-04-10' });

export async function POST(request: Request) {
  const { project, plan } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Mythos Director - ${plan}` },
        unit_amount: plan === 'starter' ? 2900 : plan === 'pro' ? 9900 : 29900
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `https://workspace-hgok0fso8-epic-tech-ai-projects.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://workspace-hgok0fso8-epic-tech-ai-projects.vercel.app/cancel`
  });

  return NextResponse.json({
    project,
    plan,
    checkout_url: session.url,
    status: 'pending_payment'
  });
}
