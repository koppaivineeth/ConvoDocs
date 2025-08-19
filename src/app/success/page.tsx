"use client";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<"success" | "pending" | "failed" | null>(null);

    useEffect(() => {
        debugger;
        // You may want to get session_id from query params if Stripe redirects with it
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");

        async function checkPaymentStatus() {
            setLoading(true); debugger
            try {
                // Adjust the endpoint as per your API route for checking payment status
                const res = await fetch(`/api/stripe/subscription-status${sessionId ? `?session_id=${sessionId}` : ""}`);
                if (!res.ok) throw new Error("Failed to fetch payment status");
                const data = await res.json();
                if (data.status === "active" || data.status === "paid") {
                    setPaymentStatus("success");
                } else if (data.status === "pending") {
                    setPaymentStatus("pending");
                } else {
                    setPaymentStatus("failed");
                }
            } catch {
                setPaymentStatus("failed");
            } finally {
                setLoading(false);
            }
        }

        checkPaymentStatus();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {loading && <p>Checking payment status...</p>}
            {!loading && paymentStatus === "success" && (
                <div>
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                    <p>Your subscription is now active. Thank you for your payment.</p>
                </div>
            )}
            {!loading && paymentStatus === "pending" && (
                <div>
                    <h1 className="text-2xl font-bold text-yellow-600 mb-4">Payment Pending</h1>
                    <p>Your payment is being processed. Please wait a moment and refresh this page.</p>
                </div>
            )}
            {!loading && paymentStatus === "failed" && (
                <div>
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
                    <p>There was an issue with your payment. Please try again or contact support.</p>
                </div>
            )}
        </div>
    );
}