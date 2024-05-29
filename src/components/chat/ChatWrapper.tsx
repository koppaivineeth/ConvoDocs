"use client"

import Messages from "./Messages"
import ChatInput from "./ChatInput"
import { trpc } from "@/app/_trpc/client"
import { ChevronLeft, Download, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { ChatContextProvider } from "./ChatContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipPortal, TooltipArrow } from "../ui/tooltip"
import { PDFDownloadLink } from "@react-pdf/renderer"
import PDFDocument from "@/lib/createMessagePDFFile"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { getUserSubscriptionPlan } from "@/lib/stripe"

interface ChatWrapperProps {
    fileId: string
    file: {
        userId: string,
        fileId: string,
        fileName: string,
        createdAt: string,
        key: string | null,
        messages: {
            userId: string | null,
            id: string,
            fileId: string | null,
            createdAt: string,
            text: string,
            isUserMessage: boolean,
            updatedAt: string | null,
        }[]
    }
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}
const ChatWrapper = ({ fileId, file, subscriptionPlan }: ChatWrapperProps) => {
    console.log("subscriptionPlan = = ", subscriptionPlan)
    const [isDownloading, setIsDownloading] = useState<any>([])
    const [isDownloadWindowOpen, setIsDownloadWindowOpen] = useState<boolean>(false)

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
        {
            fileId
        }
    )
    const { mutate: getAllFileMessages } = trpc.getAllFileMessages.useMutation({
        onSuccess: ({ messages }) => {
            setIsDownloading(true)
        },
        onMutate({ file }) {
            setIsDownloadWindowOpen(true)
        },
        onSettled() {
        }
    })
    if (isLoading)
        return (
            <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                <div className="flex-1 flex justify-center items-center flex-col mb-28">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <h3 className="font-semibold text-xl">Loading ...</h3>
                        <p className="text-zinc-500 text-sm">
                            We&apos;re preparing your PDF.
                        </p>
                    </div>
                </div>
                <ChatInput isDisabled />
            </div>
        )

    if (data?.status === "PROCESSING")
        return (
            <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                <div className="flex-1 flex justify-center items-center flex-col mb-28">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <h3 className="font-semibold text-xl">Processing PDF ...</h3>
                        <p className="text-zinc-500 text-sm">
                            This won&apos;t take long.
                        </p>
                    </div>
                </div>
                <ChatInput isDisabled />
            </div>
        )

    if (data?.status === "FAILED")
        return (
            <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                <div className="flex-1 flex justify-center items-center flex-col mb-28">
                    <div className="flex flex-col items-center gap-2">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <h3 className="font-semibold text-xl">Too many pages in PDF ...</h3>
                        <p className="text-zinc-500 text-sm">
                            Your <span className="font-medium">Free</span>{' '}
                            plan supports up to 5 pages per PDF
                        </p>
                        <Link href='/dashboard' className={buttonVariants({
                            variant: 'secondary',
                            className: "mt-4"
                        })}><ChevronLeft className="h-3 w-3 mr-1.5" /></Link>
                    </div>
                </div>
                <ChatInput isDisabled />
            </div>
        )

    return (
        <ChatContextProvider fileId={fileId}>
            <div className="chat-context-wrapper relative max-h-[calc(100vh-3rem)] h-[calc(100vh-9rem)] bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
                {/* <div className="flex justify-end p-4">
                    <Dialog open={isDownloadWindowOpen} onOpenChange={(visible) => {
                        if (!visible) {
                            setIsDownloadWindowOpen(false)
                        }
                    }}>
                        <DialogTrigger>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger className="cursor-default ml-1.5">
                                        <Download className="h-5 w-5 cursor-pointer"
                                            onClick={
                                                () => {
                                                    getAllFileMessages({ file: file })
                                                }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipPortal>
                                        <TooltipContent className="w-80 p-2 bg-black text-white text-xs">
                                            Download the chats in PDF format
                                            <TooltipArrow />
                                        </TooltipContent>
                                    </TooltipPortal>
                                </Tooltip>
                            </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent>
                            {subscriptionPlan.isSubscribed ? (
                                <div>
                                    <span className="mb-5">You can download all the chat messages!</span>
                                    <div className="flex justify-between">
                                        {!isDownloading ? (
                                            <Button disabled>Download now</Button>
                                        ) : (
                                            <PDFDownloadLink document={<PDFDocument file={file} />}>
                                                <Button>Download now</Button>
                                            </PDFDownloadLink>
                                        )}
                                        <Button className="bg-slate-500 hover:bg-slate-700" onClick={() => setIsDownloadWindowOpen(false)}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-5"><span>You can download all the chat messages! Subscribe to use this feature</span></div>
                                    <div className="flex justify-between">
                                        <Link href={'/pricing'}>
                                            <Button>Upgrade now</Button>
                                        </Link>
                                        <Button className="bg-slate-500 hover:bg-slate-700" onClick={() => setIsDownloadWindowOpen(false)}>Cancel</Button>
                                    </div>
                                </div>
                            )}

                        </DialogContent>
                    </Dialog>
                </div> */}
                <div className="flex-1 justify-between flex flex-col mb-28 max-h-[calc(100vh-8rem)] h-[calc(100vh-16rem)]">
                    <Messages fileId={fileId} />
                </div>

                <ChatInput />
            </div>
        </ChatContextProvider>
    )
}

export default ChatWrapper