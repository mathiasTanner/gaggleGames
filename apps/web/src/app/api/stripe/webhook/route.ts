import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const headerList = await headers();
  const sig = headerList.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing webhook signature or secret" },
      { status: 400 }
    );
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Checkout completed", event.data.object.id);
      break;

    case "invoice.paid":
      console.log("Invoice paid", event.data.object.id);
      break;

    default:
      console.log("Unhandled event", event.type);
  }

  return NextResponse.json({ received: true });
}
