import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { PLANS } from '@/config/stripe';

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        debugger
        const { getUser } = getKindeServerSession()
        const user = await getUser()

        if (!user || !user.id || !user.email)
            throw new TRPCError({ code: "UNAUTHORIZED" })

        // check it the user is in database
        const dbUser = await db.users.findFirst({
            where: {
                userEmail: user.email
            }
        })

        if (!dbUser) {
            await db.users.create({
                data: {
                    userId: user.id,
                    userEmail: user.email,
                    name: user.given_name!
                }
            })
        }
        return { success: true }
    }),

    getFileMessages: privateProcedure
        .input(z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(),
            fileId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const { userId } = ctx
            const { fileId, cursor } = input
            const limit = input.limit ?? INFINITE_QUERY_LIMIT

            const file = await db.user_files.findFirst({
                where: {
                    fileId: fileId,
                    userId
                }
            })

            if (!file) throw new TRPCError({ code: "NOT_FOUND" })

            const messages = await db.message.findMany({
                take: limit + 1,
                where: {
                    fileId
                },
                orderBy: {
                    createdAt: "desc"
                },
                cursor: cursor ? { id: cursor } : undefined,
                select: {
                    id: true,
                    isUserMessage: true,
                    createdAt: true,
                    text: true
                }
            })

            let nextCursor: typeof cursor | undefined = undefined
            if (messages.length > limit) {
                const nextItem = messages.pop()
                nextCursor = nextItem?.id
            }

            return {
                messages,
                nextCursor
            }
        }),
    getFileUploadStatus: privateProcedure
        .input(z.object({ fileId: z.string() }))
        .query(async ({ input, ctx }) => {
            const file = await db.user_files.findFirst({
                where: {
                    fileId: input.fileId,
                    userId: ctx.userId,
                },
            })

            if (!file) return { status: 'PENDING' as const }
            console.log("file upload status = ", file)
            return { status: file.uploadStatus }
        }),

    getFile: privateProcedure.input(z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx

            const file = await db.user_files.findFirst({
                where: {
                    key: input.key,
                    userId
                }
            })

            if (!file) throw new TRPCError({ code: "NOT_FOUND", message: "File not found" })

            return file

        }),
    getUserFiles: privateProcedure.query(async () => {

        const { getUser } = getKindeServerSession()
        const user = await getUser()
        const userFiles = await db.user_files.findMany({
            where: {
                userId: user?.id
            },
            include: {
                messages: true,
            }
        })
        return { status: "success", files: userFiles }
    }),
    getSingleFile: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;

            const file = await db.user_files.findFirst({
                where: {
                    fileId: input.id,
                    userId
                }
            })
            if (!file) throw new TRPCError({ code: "NOT_FOUND", message: "File not found" })

            return file
        }),

    getFileMessgesCount: privateProcedure
        .input(z.object({ fileId: z.string() }))
        .query(async ({ input }) => {
            const messages = await db.message.findMany({
                where: {
                    fileId: input.fileId
                }
            })

            if (!messages) return 0

            return messages.length || 0
        }),

    deleteFile: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;
            const { getUser } = getKindeServerSession()
            const user = await getUser()
            const file = await db.user_files.findFirst({
                where: {
                    fileId: input.id,
                    userId
                }
            })
            if (!file) throw new TRPCError({ code: "NOT_FOUND", message: "File not found" })

            await db.user_files.delete({
                where: {
                    fileId: input.id,
                    userId
                }
            })
            return file
        }),

    createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
        const { userId } = ctx

        const billingUrl = absoluteUrl("/dashboard/billing")

        if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" })

        const dbUser = await db.users.findFirst({
            where: {
                userId: userId
            }
        })

        if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" })

        //If user is already subscribed, take user to manage subscription, if not, they can subscribe

        const subscriptionPlan = await getUserSubscriptionPlan()

        if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: dbUser.stripeCustomerId,
                return_url: billingUrl
            })

            return { url: stripeSession.url }
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: billingUrl,
            cancel_url: billingUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            line_items: [{
                price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
                quantity: 1
            }],
            metadata: {
                userId: userId
            }
        })

        return { url: stripeSession.url }

    })
});

export type AppRouter = typeof appRouter;