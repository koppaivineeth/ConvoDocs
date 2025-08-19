import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return new Response(JSON.stringify({ error: "Missing session_id" }), { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["subscription"],
        });
        console.log("Session retrieved:", session);
        // You can adjust this logic based on your needs
        const status =
            (session.subscription && typeof session.subscription === "object"
                ? session.subscription.status
                : session.payment_status) || "unknown";

        return new Response(JSON.stringify({ status }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Unable to fetch session" }), { status: 500 });
    }
}