import express from 'express';
import Stripe from 'stripe';
import { z } from 'zod';

const app = express();
app.use(express.json());

const stripeKey = process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_API_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}
const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' });

const DeployRequest = z.object({
  project: z.string().min(2),
  plan: z.enum(['starter', 'pro', 'scale'])
});

app.post('/deploy', async (req, res) => {
  const { project, plan } = DeployRequest.parse(req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'usd', product_data: { name: `Mythos Director - ${plan}` }, unit_amount: plan === 'starter' ? 2900 : plan === 'pro' ? 9900 : 29900 }, quantity: 1 }],
    mode: 'payment',
    success_url: `https://mythos.director/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://mythos.director/cancel`
  });

  res.json({
    project,
    plan,
    checkout_url: session.url,
    status: 'pending_payment'
  });
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Deployment + billing running on :${port}`);
});
