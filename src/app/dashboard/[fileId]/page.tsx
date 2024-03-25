import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import PDFRenderer from "@/components/PDFRenderer"
import ChatWrapper from "@/components/chat/ChatWrapper"


interface PageProps {
    params: {
        fileId: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { fileId } = params

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`)

    const file = await db.user_files.findFirst({
        where: {
            fileId: fileId
        }
    })

    if (!file) notFound()

    return <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.rem)]">
        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
            {/* left side - pdf view */}
            <div className="flex-1 xl:flex">
                <div className="px-4 py-6 sm-px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                    <PDFRenderer url={file.url} />
                </div>
            </div>

            {/* right side - chat window */}
            <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-1 lg:border-t-0">
                <ChatWrapper fileId={file.fileId} />
            </div>
        </div>
    </div>
}

export default Page