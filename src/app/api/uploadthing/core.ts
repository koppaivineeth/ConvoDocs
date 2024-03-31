import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";


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

    try {
        const response = await fetch(file.url)
        const blob = await response.blob()

        const loader = new PDFLoader(blob)
        const pageLevelDocs = await loader.load()

        const pageAmt = pageLevelDocs.length

        //Vectorize and index entire document
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!)

        const embeddings = new OpenAIEmbeddings()


        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
            pineconeIndex,
            namespace: createdFile.fileId,
            maxConcurrency: 5
        })
        await db.user_files.update({
            data: {
                uploadStatus: 'SUCCESS'
            },
            where: {
                fileId: createdFile.fileId
            }
        })
    } catch (err) {
        await db.user_files.update({
            data: {
                uploadStatus: 'FAILED'
            },
            where: {
                fileId: createdFile.fileId
            }
        })
    }
}

export const ourFileRouter = {
    freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;