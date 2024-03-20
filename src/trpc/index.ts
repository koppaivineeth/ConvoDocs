import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
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
                    name: user.given_name
                }
            })
        }

        return { success: true }
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

            if (!file) throw new TRPCError({ code: "NOT_FOUND" })

            return file

        }),
    getUserFiles: privateProcedure.query(async () => {

        const { getUser } = getKindeServerSession()
        const user = await getUser()
        const userFiles = await db.user_files.findMany({
            where: {
                userId: user?.id
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
            if (!file) throw new TRPCError({ code: "FILE_NOT_FOUND" })

            return file
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
            if (!file) throw new TRPCError({ code: "FILE_NOT_FOUND" })

            await db.user_files.delete({
                where: {
                    fileId: input.id,
                    userId
                }
            })
            return file
        })
});

export type AppRouter = typeof appRouter;