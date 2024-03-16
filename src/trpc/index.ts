import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import excuteQuery from '@/db';
import { z } from 'zod';

export const appRouter = router({
    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession()
        const user = await getUser()

        if (!user || !user.id || !user.email)
            throw new TRPCError({ code: "UNAUTHORIZED" })

        // check it the user is in database
        const dbUser = await excuteQuery({
            query: "SELECT * FROM users WHERE userEmail = ?",
            values: [user.email]
        })
        if (dbUser.length === 0) {
            const insertUser = await excuteQuery({
                query: 'INSERT INTO users (userId, userEmail, name) VALUES(?,?,?)',
                values: [user.id, user.email, user.given_name]
            })
        }

        return { success: true }
    }),
    getUserFiles: privateProcedure.query(async () => {

        const { getUser } = getKindeServerSession()
        const user = await getUser()
        const userFiles = await excuteQuery({
            query: "SELECT * FROM user_files WHERE userId = ?",
            values: [user?.id]
        })
        return { status: "success", files: userFiles }
    }),
    deleteFile: privateProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { getUser } = getKindeServerSession()
            const user = await getUser()
            const file = await excuteQuery({
                query: "SELECT * FROM user_files WHERE userId = ?",
                values: [user?.id]
            })
            if (!file) throw new TRPCError({ code: "FILE_NOT_FOUND" })

            await excuteQuery({
                query: "DELETE FROM user_files WHERE fileId = ? AND userId = ?",
                values: [input.id, user?.id]
            })
            return file
        })
    // deleteFile: privateProcedure.query(async (fileId) => {
    //     const { getUser } = getKindeServerSession()
    //     const user = await getUser()
    //     const deletedFile = await excuteQuery({
    //         query: "DELETE FROM user_files WHERE fileId = ? AND userId = ?",
    //         values: [fileId, user?.id]
    //     })
    //     console.log(deletedFile)
    //     return { status: "success", message: "File deleted" }
    // })
});

export type AppRouter = typeof appRouter;