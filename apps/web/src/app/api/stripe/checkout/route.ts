import { NextResponse } from "next/server";
import { getProductBySlug, isPurchasable } from "@/lib/strapi/products";
import { getStripe } from "@/lib/stripe";

type CheckoutRequest = {
  productSlug?: string;
};

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  let payload: CheckoutRequest;
  try {
    payload = (await req.json()) as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const productSlug = payload.productSlug?.trim();
  if (!productSlug) {
    return NextResponse.json({ error: "Missing productSlug" }, { status: 400 });
  }

  const product = await getProductBySlug(productSlug);
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (!isPurchasable(product)) {
    return NextResponse.json(
      { error: "Product is not currently available for checkout" },
      { status: 409 }
    );
  }

  if (product.priceCents <= 0) {
    return NextResponse.json(
      { error: "Product price is not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const lineItem = product.stripePriceId
    ? { price: product.stripePriceId, quantity: 1 }
    : {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.title,
            description: product.shortDescription || undefined,
            images: product.coverImage?.url.startsWith("http")
              ? [product.coverImage.url]
              : undefined,
          },
          unit_amount: product.priceCents,
        },
        quantity: 1,
      };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [lineItem],
    metadata: {
      productSlug: product.slug,
      productTitle: product.title,
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
