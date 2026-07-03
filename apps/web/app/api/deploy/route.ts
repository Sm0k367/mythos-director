import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { project, plan } = await request.json();

  // Production-safe mock — replace with real Stripe when key is present
  return NextResponse.json({
    project,
    plan,
    checkout_url: `https://checkout.stripe.com/mock?plan=${plan}`,
    status: 'pending_payment'
  });
}
