import { useState } from "react";

type BillingStatus = "idle" | "loading" | "success" | "error";

export function useBillings() {
    const [status, setStatus] = useState<BillingStatus>("idle");
    const [error, setError] = useState<string | null>(null);

    // 1. Start a Stripe Checkout session for recurring (subscription) payment
    async function createSubscriptionCheckoutSession(priceId: string) {
        setStatus("loading");
        setError(null);
        try {
            const res = await fetch("/api/stripe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url + `?session_id=${data.sessionId}`; // Redirect to Stripe Checkout
                setStatus("success");
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (err: any) {
            setError(err.message || "Failed to create checkout session");
            setStatus("error");
        }
    }

    // 2. Cancel a Stripe subscription
    async function cancelSubscription(subscriptionId: string) {
        setStatus("loading");
        setError(null);
        try {
            const res = await fetch("/api/stripe/cancel-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId }),
            });
            if (!res.ok) throw new Error("Failed to cancel subscription");
            setStatus("success");
        } catch (err: any) {
            setError(err.message || "Failed to cancel subscription");
            setStatus("error");
        }
    }

    // 3. Get current user's subscription status
    async function fetchSubscriptionStatus() {
        setStatus("loading");
        setError(null);
        try {
            const res = await fetch("/api/stripe/subscription-status", {
                method: "GET",
            });
            if (!res.ok) throw new Error("Failed to fetch subscription status");
            const data = await res.json();
            setStatus("success");
            return data;
        } catch (err: any) {
            setError(err.message || "Failed to fetch subscription status");
            setStatus("error");
            return null;
        }
    }

    return {
        status,
        error,
        createSubscriptionCheckoutSession,
        cancelSubscription,
        fetchSubscriptionStatus,
    };
}