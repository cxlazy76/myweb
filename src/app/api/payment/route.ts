import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    // Stripe Checkout redirect for cards
    if (type === "checkout") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "AI Greeting Video",
                description: "Personalized AI video message",
              },
              unit_amount: 399,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/characters`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Native Apple/Google Pay via PaymentIntent
    if (type === "wallet") {
      const intent = await stripe.paymentIntents.create({
        amount: 399,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      return NextResponse.json({ clientSecret: intent.client_secret });
    }

    return NextResponse.json({ error: "Invalid payment type" }, { status: 400 });
  } catch (err) {
    console.error("❌ Payment creation error:", err);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}