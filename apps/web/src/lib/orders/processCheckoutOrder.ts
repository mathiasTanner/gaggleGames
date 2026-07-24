import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation";
import {
  createOrUpdateOrderFromCheckout,
  updateOrderEmailStatus,
} from "@/lib/strapi/orders";
import { getStripe } from "@/lib/stripe";

export type CheckoutOrderResult =
  | {
      ok: true;
      orderNumber: string;
      emailStatus: "pending" | "sent" | "skipped" | "failed";
    }
  | {
      ok: false;
      reason:
        | "missing_session_id"
        | "unpaid_session"
        | "order_processing_failed";
      error?: string;
    };

export async function processCheckoutOrder(
  sessionId: string | null | undefined
): Promise<CheckoutOrderResult> {
  if (!sessionId) {
    return { ok: false, reason: "missing_session_id" };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return { ok: false, reason: "unpaid_session" };
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });

    const order = await createOrUpdateOrderFromCheckout({ session, lineItems });

    if (order.emailStatus === "sent") {
      return {
        ok: true,
        orderNumber: order.orderNumber,
        emailStatus: order.emailStatus,
      };
    }

    const emailResult = await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      session,
      lineItems,
    });

    if (emailResult.ok) {
      await updateOrderEmailStatus(order, {
        emailStatus: "sent",
        emailProviderMessageId: emailResult.emailId,
        emailError: null,
      });

      return {
        ok: true,
        orderNumber: order.orderNumber,
        emailStatus: "sent",
      };
    }

    const emailStatus =
      emailResult.reason === "missing_customer_email" ? "skipped" : "failed";

    await updateOrderEmailStatus(order, {
      emailStatus,
      emailError: "error" in emailResult ? emailResult.error : emailResult.reason,
    });

    return {
      ok: true,
      orderNumber: order.orderNumber,
      emailStatus,
    };
  } catch (err) {
    return {
      ok: false,
      reason: "order_processing_failed",
      error: err instanceof Error ? err.message : "Unknown order processing error",
    };
  }
}
