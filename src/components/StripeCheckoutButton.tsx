"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckoutButton({ priceId }: { priceId: string }) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            body: JSON.stringify({ priceId }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.url.split("/").pop() });
        setLoading(false);
    };

    return (
        <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>
    );
}