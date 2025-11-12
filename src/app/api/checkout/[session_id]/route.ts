import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(_req: Request, { params }: { params: Promise<{ session_id: string }> }) {
  try {
    const { session_id } = await params;
    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["payment_intent"] });
    return NextResponse.json({ payment_status: session.payment_status });
  } catch {
    return NextResponse.json({ error: "Unable to verify payment" }, { status: 500 });
  }
}
