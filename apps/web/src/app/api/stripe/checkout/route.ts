import { NextResponse } from "next/server";
import { getProductBySlug, isPurchasable } from "@/lib/strapi/products";
import { getStripe } from "@/lib/stripe";

type CheckoutRequest = {
  productSlug?: string;
  items?: {
    productSlug?: string;
    quantity?: number;
  }[];
};

function normalizeQuantity(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.min(99, Math.max(1, Math.floor(value)));
}

function normalizeCheckoutItems(payload: CheckoutRequest) {
  const itemMap = new Map<string, number>();

  if (Array.isArray(payload.items)) {
    for (const item of payload.items) {
      const productSlug = item.productSlug?.trim();
      if (!productSlug) continue;
      itemMap.set(
        productSlug,
        Math.min(
          99,
          (itemMap.get(productSlug) ?? 0) + normalizeQuantity(item.quantity)
        )
      );
    }
  }

  const productSlug = payload.productSlug?.trim();
  if (productSlug) {
    itemMap.set(productSlug, Math.min(99, (itemMap.get(productSlug) ?? 0) + 1));
  }

  return Array.from(itemMap, ([productSlug, quantity]) => ({
    productSlug,
    quantity,
  }));
}

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

  const checkoutItems = normalizeCheckoutItems(payload);
  if (checkoutItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const products = await Promise.all(
    checkoutItems.map(async (item) => ({
      ...item,
      product: await getProductBySlug(item.productSlug),
    }))
  );

  const missingProduct = products.find(({ product }) => !product?.isActive);
  if (missingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const unavailableProduct = products.find(
    ({ product }) => !product || !isPurchasable(product)
  );
  if (unavailableProduct) {
    return NextResponse.json(
      { error: "One or more products are not currently available for checkout" },
      { status: 409 }
    );
  }

  const unpricedProduct = products.find(
    ({ product }) => !product || product.priceCents <= 0
  );
  if (unpricedProduct) {
    return NextResponse.json(
      { error: "One or more product prices are not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();

  const lineItems = products.map(({ product, quantity }) => {
    if (!product) throw new Error("Product not found after validation");

    return product.stripePriceId
      ? { price: product.stripePriceId, quantity }
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
          quantity,
        };
  });

  const cartSummary = products
    .map(({ product, quantity }) => `${product?.slug}:${quantity}`)
    .join(",");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    metadata: {
      cart: cartSummary.slice(0, 500),
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
