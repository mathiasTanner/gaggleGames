import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation";
import {
  createOrUpdateOrderFromCheckout,
  updateOrderEmailStatus,
} from "@/lib/strapi/orders";
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

  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(stripe, event.data.object);
      break;

    case "checkout.session.async_payment_succeeded":
      await handleCheckoutCompleted(stripe, event.data.object);
      break;

    case "invoice.paid":
      console.log("Invoice paid", event.data.object.id);
      break;

    default:
      console.log("Unhandled event", event.type);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  if (session.payment_status !== "paid") {
    console.log("Checkout completed before payment was paid", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });

  const order = await createOrUpdateOrderFromCheckout({ session, lineItems });

  if (order.emailStatus === "sent") {
    console.log("Order confirmation already sent", {
      orderNumber: order.orderNumber,
      sessionId: session.id,
    });
    return;
  }

  const result = await sendOrderConfirmationEmail({
    orderNumber: order.orderNumber,
    session,
    lineItems,
  });

  if (result.ok) {
    await updateOrderEmailStatus(order, {
      emailStatus: "sent",
      emailProviderMessageId: result.emailId,
      emailError: null,
    });

    console.log("Order confirmation sent", {
      orderNumber: result.orderNumber,
      sessionId: session.id,
      emailId: result.emailId,
    });
    return;
  }

  await updateOrderEmailStatus(order, {
    emailStatus: result.reason === "missing_customer_email" ? "skipped" : "failed",
    emailError: "error" in result ? result.error : result.reason,
  });

  console.warn("Order confirmation not sent", {
    orderNumber: order.orderNumber,
    sessionId: session.id,
    reason: result.reason,
    error: "error" in result ? result.error : undefined,
  });
}
