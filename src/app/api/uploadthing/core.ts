import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const middleware = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) throw new Error('Unauthorized')

    return { user: user.id };
}

const onUploadComplete = async ({
    metadata,
    file,
}: {
    metadata: Awaited<ReturnType<typeof middleware>>
    file: {
        key: string
        name: string
        url: string
    }
}) => {
    console.log("UPLOAD COMPLETE = ", file)
    const isFileExist = await db.user_files.findFirst({
        where: {
            key: file.key,
        },
    })

    if (isFileExist) return

    const createdFile = await db.user_files.create({
        data: {
            key: file.key,
            fileName: file.name,
            userId: metadata.user,
            url: file.url,
            uploadStatus: 'PROCESSING',
        },
    })
}

export const ourFileRouter = {
    freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;