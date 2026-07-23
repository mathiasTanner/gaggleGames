import type Stripe from "stripe";
import { parseSender, sendBrevoEmail } from "./brevo";

type OrderLineItem = {
  name: string;
  quantity: number;
  amountTotal: number;
  currency: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function getCustomerEmail(session: Stripe.Checkout.Session) {
  return session.customer_details?.email ?? session.customer_email ?? null;
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
  return lineItems.data.map<OrderLineItem>((item) => ({
    name: getLineItemName(item),
    quantity: item.quantity ?? 1,
    amountTotal: item.amount_total ?? 0,
    currency: item.currency ?? "eur",
  }));
}

function buildTextEmail(params: {
  orderNumber: string;
  session: Stripe.Checkout.Session;
  items: OrderLineItem[];
}) {
  const { orderNumber, session, items } = params;
  const currency = session.currency ?? items[0]?.currency ?? "eur";
  const total = session.amount_total ?? items.reduce((sum, item) => sum + item.amountTotal, 0);
  const itemLines = items
    .map(
      (item) =>
        `- ${item.quantity} x ${item.name}: ${formatMoney(
          item.amountTotal,
          item.currency
        )}`
    )
    .join("\n");

  return [
    "Thanks for your order from Gaggle Games.",
    "",
    `Order number: ${orderNumber}`,
    `Order total: ${formatMoney(total, currency)}`,
    "",
    "Items ordered:",
    itemLines || "- Your Gaggle Games order",
    "",
    "Keep this email in case you need help with your order.",
  ].join("\n");
}

function buildHtmlEmail(params: {
  orderNumber: string;
  session: Stripe.Checkout.Session;
  items: OrderLineItem[];
}) {
  const { orderNumber, session, items } = params;
  const currency = session.currency ?? items[0]?.currency ?? "eur";
  const total = session.amount_total ?? items.reduce((sum, item) => sum + item.amountTotal, 0);
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #d8e8ee;">
            <strong>${escapeHtml(item.name)}</strong><br>
            <span style="color:#5d6a81;">Quantity: ${item.quantity}</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #d8e8ee;">
            ${formatMoney(item.amountTotal, item.currency)}
          </td>
        </tr>`
    )
    .join("");

  return `
    <div style="margin:0;padding:0;background:#f6fbfd;color:#102033;font-family:Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6fbfd;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #d8e8ee;">
              <tr>
                <td style="padding:28px 28px 8px;">
                  <p style="margin:0 0 12px;color:#1193b2;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Gaggle Games</p>
                  <h1 style="margin:0;color:#102033;font-size:30px;line-height:1.2;">Thanks for your order.</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 28px 24px;">
                  <p style="margin:0;color:#5d6a81;font-size:16px;line-height:1.6;">
                    We have received your order. Keep this confirmation in case you need help later.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 24px;">
                  <div style="background:#102033;color:#ffffff;padding:18px;">
                    <p style="margin:0 0 8px;color:#ffd447;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Order number</p>
                    <p style="margin:0;font-size:24px;font-weight:700;">${escapeHtml(orderNumber)}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;color:#102033;">
                    ${rows || `<tr><td style="padding:12px 0;">Your Gaggle Games order</td></tr>`}
                    <tr>
                      <td style="padding:18px 0;font-size:18px;font-weight:700;">Total</td>
                      <td align="right" style="padding:18px 0;font-size:18px;font-weight:700;">${formatMoney(total, currency)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 28px;">
                  <p style="margin:0;color:#5d6a81;font-size:13px;line-height:1.6;">
                    Stripe checkout session: ${escapeHtml(session.id)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;
}

export async function sendOrderConfirmationEmail(params: {
  orderNumber: string;
  session: Stripe.Checkout.Session;
  lineItems: Stripe.ApiList<Stripe.LineItem>;
}) {
  const { orderNumber, session, lineItems } = params;
  const to = getCustomerEmail(session);

  if (!to) {
    return { ok: false as const, reason: "missing_customer_email" as const };
  }

  const from = process.env.ORDER_CONFIRMATION_FROM_EMAIL;
  if (!from) {
    return { ok: false as const, reason: "not_configured" as const };
  }

  const items = mapLineItems(lineItems);
  const subject = `Gaggle Games order ${orderNumber}`;

  const result = await sendBrevoEmail(
    {
      sender: parseSender(from),
      to: [{ email: to }],
      subject,
      htmlContent: buildHtmlEmail({ orderNumber, session, items }),
      textContent: buildTextEmail({ orderNumber, session, items }),
      tags: ["order_confirmation", "gaggle_games"],
      headers: {
        "X-Gaggle-Order": orderNumber,
        "X-Stripe-Session": session.id,
      },
    }
  );

  if (!result.ok) return result;

  return { ok: true as const, emailId: result.id, orderNumber };
}
