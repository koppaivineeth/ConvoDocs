import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";


const f = createUploadthing();

const middleware = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) throw new Error('Unauthorized')

    const subsriptionPlan = await getUserSubscriptionPlan()

    return { subsriptionPlan, user: user.id };
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
        type: string
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
            fileType: file.type
        },
    })

    try {
        const response = await fetch(file.url)
        const blob = await response.blob()

        let loader
        if (file.type === "pdf")
            loader = new PDFLoader(blob)
        else
            loader = new TextLoader(blob)

        const pageLevelDocs = await loader.load()

        const pageAmt = pageLevelDocs.length

        const { subsriptionPlan } = metadata
        const { isSubscribed } = subsriptionPlan

        const isProExceeded = pageAmt > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf
        const isFreeExceeded = pageAmt > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf


        if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
            await db.user_files.update({
                data: {
                    uploadStatus: "FAILED"
                },
                where: {
                    fileId: createdFile.fileId
                }
            })
        }

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
    freePlanUploader: f({
        pdf: { maxFileSize: "4MB" },
        text: { maxFileSize: "4MB" }
    })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete),
    proPlanUploader: f({
        pdf: { maxFileSize: "16MB" },
        text: { maxFileSize: "16MB" }
    })
        .middleware(middleware)
        .onUploadComplete(onUploadComplete)
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;