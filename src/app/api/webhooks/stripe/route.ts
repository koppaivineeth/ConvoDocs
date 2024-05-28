import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import type Stripe from 'stripe'

export async function POST(request: Request) {
    const body = await request.text()
    const signature = headers().get('stripe-signature') ?? ''

    let event: Stripe.Event
    console.log("STRIPE_SUBSCRIPTION_HOOK")
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        )
    } catch (err) {
        return new Response(
            `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'
            }`,
            { status: 400 }
        )
    }

    const session = event.data
        .object as Stripe.Checkout.Session
    console.log("STRIPE_SESSION = ", session)
    if (!session?.metadata?.userId) {
        return new Response(null, {
            status: 200,
        })
    }
    console.log("stripe event = ", event)
    if (event.type === 'checkout.session.completed') {
        const subscription =
            await stripe.subscriptions.retrieve(
                session.subscription as string
            )
        console.log("checkout subscription object = ", subscription)
        await db.users.update({
            where: {
                userId: session.metadata.userId,
            },
            data: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    if (event.type === 'invoice.payment_succeeded') {
        // Retrieve the subscription details from Stripe.
        const subscription =
            await stripe.subscriptions.retrieve(
                session.subscription as string
            )
        console.log("invoice subscription object = ", subscription)

        await db.users.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            },
        })
    }

    return new Response(null, { status: 200 })
}
