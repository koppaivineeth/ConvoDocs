import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
    const { priceId } = await req.json();

    try {
        console.log("Creating Stripe session for priceId:", priceId);
        if (!priceId) {
            return new Response("Missing priceId", { status: 400 });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        });
        console.log("Stripe session id created after payment:", session.id);
        return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), { status: 200 });
    } catch (err) {
        return new Response("Stripe session error", { status: 500 });
    }
}