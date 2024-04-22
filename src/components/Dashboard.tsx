"use client"

import { trpc } from "@/app/_trpc/client"
import UploadButton from "./UploadButton"
import { Ghost, Loader2, MessageSquare, Plus, Trash, CircleCheck, Circle, Check } from "lucide-react"
import Link from 'next/link'
import Skeleteon from 'react-loading-skeleton'
import { format } from 'date-fns'
import { Button } from "./ui/button"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { useState } from "react"
import { cn } from "@/lib/utils"


interface PageProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}
const Dashboard = ({ subscriptionPlan }: PageProps) => {
    const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(
        null
    )
    const [isAllSeleted, setIsAllSeleted] = useState<boolean>(false)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const utils = trpc.useUtils()
    const { data: files, isLoading } = trpc.getUserFiles.useQuery()


    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate()
        },
        onMutate({ id }) {
            setCurrentlyDeletingFile(id)
        },
        onSettled() {
            setCurrentlyDeletingFile(null)
        }
    })
    const toggleSelectAll = () => setIsAllSeleted((prev) => !prev)

    return (
        <main className="mx-auto max-w-7xl md:p-10">
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900">
                    My Files
                </h1>
                <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
            </div>
            <div className="py-5 border-solid border-b-2">
                <ul className="">
                    <li className={cn("inline bg-white p-3 rounded-full", {
                        "bg-slate-300": isAllSeleted
                    })}
                        onClick={() => toggleSelectAll()}>
                        {isAllSeleted ? (
                            <CircleCheck className="h-5 w-5 inline" />
                        ) : (
                            <Circle className="h-5 w-5 inline" />
                        )}

                        <span className="inline pl-3">Select All</span>
                    </li>
                    <li className="inline bg-white ml-10 p-3 rounded-full">
                        <span className="ml-5">Delete All</span>
                    </li>
                </ul>
            </div>
            {/* Display all user files */}
            {files && files.files && files.files?.length !== 0 ? (
                <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                    {
                        files.files.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                            .map((file) => (
                                <li key={file.fileId} className='relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                                    <span className="absolute left-2 top-2"
                                        onClick={() => {
                                            const newFiles = [...selectedFiles]
                                            if (newFiles.includes(file)) {
                                                newFiles.splice(newFiles.indexOf(file), 1)
                                            } else {
                                                newFiles.push(file)
                                            }
                                            setSelectedFiles(newFiles)
                                        }}
                                    >
                                        {selectedFiles.includes(file) ? (
                                            <CircleCheck className="h-5 w-5" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}

                                        {/*  */}
                                    </span>
                                    <Link href={file.fileType === "pdf" ? `/pdf-chat/${file.fileId}` : file.fileType === "text" ? `text-file-chat/${file.fileId}` : ""} className="flex flex-col gap-2">
                                        <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500' />
                                            <div className='flex-1 truncate'>
                                                <div className='flex items-center space-x-3'>
                                                    <h3 className='truncate text-lg font-medium text-zinc-900'>{file.fileName}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            {format(new Date(file.createdAt!), "MMM yyyy")}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Display file message count */}
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{file.messages.length}</span>
                                        </div>

                                        <Button
                                            onClick={() => {
                                                deleteFile({ id: file.fileId })
                                            }}
                                            size="sm" className="w-full" variant="destructive">
                                            {currentlyDeletingFile === file.fileId ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : <Trash />}
                                        </Button>
                                    </div>
                                </li>
                            ))
                    }
                </ul>
            ) : isLoading ? (
                <Skeleteon height={100} className="my-2" count={3} />
            ) : (
                <div className="mt-16 flex flex-col items-center gap-2">
                    <Ghost className="h-8 w-8 text-zin-800" />
                    <h3 className="font-semibold text-xl">Empty here</h3>
                    <p>Let&apos;s upload your first PDF</p>
                </div>
            )}
        </main >
    )
}

export default Dashboard