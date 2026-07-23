import type Stripe from "stripe";

type OrderLineItemSnapshot = {
  name: string;
  quantity: number;
  amountTotalCents: number;
  currency: string;
  stripePriceId?: string;
  stripeProductId?: string;
};

export type PersistedOrder = {
  documentId: string;
  orderNumber: string;
  stripeSessionId: string;
  customerEmail: string;
  emailStatus: "pending" | "sent" | "skipped" | "failed";
};

type StrapiOrderResponse = {
  data: PersistedOrder;
};

function getBaseUrl() {
  const baseUrl = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL;
  if (!baseUrl) throw new Error("Missing CMS_URL / NEXT_PUBLIC_CMS_URL");
  return baseUrl.replace(/\/$/, "");
}

function getToken() {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) throw new Error("Missing STRAPI_API_TOKEN");
  return token;
}

async function strapiOrderRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${getBaseUrl()}/api${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Strapi order request failed (${response.status}) ${path}\n${body}`);
  }

  return response.json() as Promise<T>;
}

function getProductId(item: Stripe.LineItem) {
  const product = item.price?.product;
  if (!product) return undefined;
  return typeof product === "string" ? product : product.id;
}

function getLineItemName(item: Stripe.LineItem) {
  if (item.description) return item.description;

  const product = item.price?.product;
  if (product && typeof product !== "string" && !product.deleted) {
    return product.name;
  }

  return "Gaggle Games item";
}

function mapLineItems(lineItems: Stripe.ApiList<Stripe.LineItem>) {
  return lineItems.data.map<OrderLineItemSnapshot>((item) => ({
    name: getLineItemName(item),
    quantity: item.quantity ?? 1,
    amountTotalCents: item.amount_total ?? 0,
    currency: item.currency ?? "chf",
    stripePriceId: item.price?.id,
    stripeProductId: getProductId(item),
  }));
}

function buildOrderNumber(session: Stripe.Checkout.Session) {
  return `GG-${session.id.slice(-8).toUpperCase()}`;
}

function getCustomerEmail(session: Stripe.Checkout.Session) {
  return session.customer_details?.email ?? session.customer_email ?? null;
}

function getCustomerName(session: Stripe.Checkout.Session) {
  return session.customer_details?.name ?? undefined;
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  const paymentIntent = session.payment_intent;
  if (!paymentIntent) return undefined;
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

async function findOrderByStripeSessionId(stripeSessionId: string) {
  const query = new URLSearchParams({
    "filters[stripeSessionId][$eq]": stripeSessionId,
  });

  const response = await strapiOrderRequest<{ data: PersistedOrder[] }>(
    `/orders?${query.toString()}`
  );

  return response.data[0] ?? null;
}

export async function createOrUpdateOrderFromCheckout(params: {
  session: Stripe.Checkout.Session;
  lineItems: Stripe.ApiList<Stripe.LineItem>;
}) {
  const { session, lineItems } = params;
  const customerEmail = getCustomerEmail(session);

  if (!customerEmail) {
    throw new Error(`Stripe session ${session.id} is missing a customer email`);
  }

  const existingOrder = await findOrderByStripeSessionId(session.id);
  const payload = {
    data: {
      orderNumber: existingOrder?.orderNumber ?? buildOrderNumber(session),
      stripeSessionId: session.id,
      stripePaymentIntentId: getPaymentIntentId(session),
      customerEmail,
      customerName: getCustomerName(session),
      status: session.payment_status === "paid" ? "paid" : "pending",
      currency: (session.currency ?? lineItems.data[0]?.currency ?? "chf").toUpperCase(),
      amountTotalCents:
        session.amount_total ??
        lineItems.data.reduce((sum, item) => sum + (item.amount_total ?? 0), 0),
      items: mapLineItems(lineItems),
      emailStatus: existingOrder?.emailStatus ?? "pending",
      paidAt: session.payment_status === "paid" ? new Date().toISOString() : undefined,
    },
  };

  if (existingOrder) {
    const response = await strapiOrderRequest<StrapiOrderResponse>(
      `/orders/${existingOrder.documentId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return response.data;
  }

  const response = await strapiOrderRequest<StrapiOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateOrderEmailStatus(
  order: PersistedOrder,
  data: {
    emailStatus: PersistedOrder["emailStatus"];
    emailProviderMessageId?: string | null;
    emailError?: string | null;
  }
) {
  const response = await strapiOrderRequest<StrapiOrderResponse>(
    `/orders/${order.documentId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        data: {
          emailStatus: data.emailStatus,
          emailProviderMessageId: data.emailProviderMessageId ?? undefined,
          emailError: data.emailError ?? undefined,
        },
      }),
    }
  );

  return response.data;
}
