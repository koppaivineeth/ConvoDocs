import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import PDFRenderer from "@/components/PDFRenderer"
import ChatWrapper from "@/components/chat/ChatWrapper"
import { Suspense } from "react"
import PageLoader from "@/components/PageLoader"
import SideBar from "@/components/Sidebar"
import Link from "next/link"
import UploadButton from "@/components/UploadButton"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AfterServerComponentRender from "@/components/AfterServerComponentRender"
import { Textarea } from "@/components/ui/textarea"
import NotesInput from "@/components/notes/NotesInput"

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

    const files = await db.user_files.findMany({
        where: {
            userId: user?.id
        },
        include: {
            messages: true
        }
    })

    if (!files) notFound()

    const file = await db.user_files.findFirst({
        where: {
            fileId: fileId
        },
        include: {
            messages: true
        }
    })

    if (!file) notFound()

    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <>
            <AfterServerComponentRender hideBodyScroll={true} />
            <Suspense fallback={<PageLoader />}>
                <SideBar>
                    <div className="flex justify-center">
                        <UploadButton buttonClass="bg-white text-blue-600 mt-5" isSubscribed={subscriptionPlan.isSubscribed} elementType='link' uploadButtonText="Upload new PDF" fileType="pdf" />
                    </div>
                    <div className="border p-3 mt-3 h-[calc(100vh-12rem)]">
                        <div className="p-3 title text-center mt-5 mb-5 static text-lg">
                            <span>
                                Click a file
                            </span>
                        </div>
                        <div className="file-list flex justify-center overflow-auto h-[76%] pb-3">
                            {
                                <ul>
                                    {files && files.map((file) => (
                                        <li key={file.fileId} className="text-xs cursor-pointer pb-3 pt-3 border-b border-solid border-zinc-200">
                                            <Link href={
                                                file.fileType === "pdf" ? `/pdf-chat/${file.fileId}` : file.fileType === "text" ? `text-file-chat/${file.fileId}` : ""
                                            }
                                                className="flex flex-col gap-2"
                                            >
                                                {file.fileName}
                                            </Link>

                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </div>
                </SideBar>
                <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] pb-10">
                    <div className="mx-auto w-full max-w-8xl lg:flex xl:px-2">
                        {/* left side - pdf view */}
                        <div className="flex-1 xl:flex">
                            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                                <PDFRenderer url={file.url} />
                            </div>
                        </div>

                        {/* right side - chat window */}
                        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-1 lg:border-t-0">
                            <Tabs defaultValue="chat" className="pt-6">
                                <TabsList className="w-full flex justify-around h-14">
                                    <TabsTrigger value="chat" className="w-full h-10">Chat</TabsTrigger>
                                    <TabsTrigger value="notes" className="w-full h-10">Notes</TabsTrigger>
                                </TabsList>
                                <TabsContent value="chat">
                                    <ChatWrapper fileId={file.fileId} file={file} subscriptionPlan={subscriptionPlan} />
                                </TabsContent>
                                <TabsContent value="notes" className="overflow-scroll">
                                    <NotesInput fileId={file.fileId} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    )
}

export default Page