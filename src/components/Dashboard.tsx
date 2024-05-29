"use client"

import { trpc } from "@/app/_trpc/client"
import UploadButton from "./UploadButton"
import { Ghost, Loader2, MessageSquare, Plus, Trash, CircleCheck, Circle, CircleMinus, Download } from "lucide-react"
import Link from 'next/link'
import Skeleteon from 'react-loading-skeleton'
import { format } from 'date-fns'
import { Button } from "./ui/button"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import PDFDocument from "@/lib/createMessagePDFFile"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import PageLoader from "./PageLoader"

interface PageProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
    fileType: string
    uploadFileType: string
    customClass: string | null | undefined
}

const Dashboard = ({ subscriptionPlan, fileType, uploadFileType, customClass }: PageProps) => {
    const showSelectAll = false

    const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(
        null
    )
    const [isAllSeleted, setIsAllSeleted] = useState<boolean>(false)
    const [isPartialSelect, setIsPartialSeleted] = useState<boolean>(false)
    const [isFilesDeleting, setIsFilesDeleting] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isFilesEmpty, setIsFilesEmpty] = useState<boolean>(false)
    const [isAnyFileSelected, setIsAnyFileSelected] = useState<boolean>(false)
    const [selectedFiles, setSelectedFiles] = useState<any>([])
    const [isDownloading, setIsDownloading] = useState<any>([])
    const [isDownloadWindowOpen, setIsDownloadWindowOpen] = useState<boolean>(false)
    const [showLoadingIcon, setShowLoadingIcon] = useState<boolean>(false)

    const utils = trpc.useUtils()
    const { data: files, isLoading } = trpc.getUserFiles.useQuery()
    const { mutate: getAllFileMessages } = trpc.getAllFileMessages.useMutation({
        onSuccess: () => {
            setIsDownloading(true)
        },
        onMutate() {
            setIsDownloadWindowOpen(true)
        },
        onSettled() {
        }
    })

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

    const { mutate: deleteFiles } = trpc.deleteFiles.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate()
        },
        onMutate({ ids }) {
            setIsFilesDeleting(true)
        },
        onSettled() {
            setIsFilesDeleting(false)
            setIsAllSeleted(false)
            setIsPartialSeleted(false)
        }
    })
    const selectAllFiles = () => {
        let allFiles = files?.files
        setSelectedFiles(allFiles)
        setIsAllSeleted((prev) => !prev)
        setIsAnyFileSelected(true)
        isAllSeleted && deselectAllFiles()
    }
    const deselectAllFiles = () => {
        const filesCopy = [...selectedFiles]
        filesCopy.splice(0, filesCopy.length)
        setSelectedFiles(filesCopy)
        if (selectedFiles.length === 0) setIsAnyFileSelected(false)
    }

    const checkIsFileSelected = (file: any) => {
        return selectedFiles.includes(file)
    }

    const deleteAllFiles = () => {
        const files = selectedFiles
        if (selectedFiles.length !== 0) {
            const fileIds = files.map((file: { fileId: any }) => file.fileId)
            deleteFiles({ ids: fileIds })
        }
    }

    const dummyMessages = [{
        id: "1",
        text: "Question 1",
        isUserMessage: true,
        createdAt: new Date()
    },
    {
        id: "2",
        text: "Answer 1",
        isUserMessage: false,
        createdAt: new Date()
    }]

    const dummyFile = {
        fileName: "Dummy",
        fileId: "1",
        messages: dummyMessages
    }
    useEffect(() => {
        const isEmpty = files === null || files?.files.length === 0
        setIsFilesEmpty(isEmpty)
    }, [files])

    return (
        <>
            <main className={cn("mx-auto max-w-7xl md:p-10 select-none", customClass)}>
                <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                    <h1 className="mb-3 font-bold text-4xl text-gray-900">
                        My Files
                    </h1>
                    <UploadButton isSubscribed={subscriptionPlan.isSubscribed} elementType='button' uploadButtonText={fileType === "pdf" ? "Upload PDF" : fileType === "all" ? "Upload PDF/Text" : "Upload text file"} fileType="all" />
                </div>

                {/* Display both PDF and text files in same screen using Accordion */}

                <Accordion type="single" defaultValue="PDF">
                    <AccordionItem value="PDF" className="bg-white px-10 mb-5">
                        <AccordionTrigger className="hover:no-underline text-lg">PDF files</AccordionTrigger>
                        <AccordionContent>
                            <div className={cn("py-5 border-solid border-b-2", {
                                "hidden": !showSelectAll
                            })}>
                                <div className="grid grid-flow-row grid-cols-2 gap-4">
                                    <div>
                                        <ul className="">
                                            <li className={cn("inline bg-white p-3 rounded-full cursor-pointer", {
                                                "bg-slate-300": isAllSeleted,
                                                "pointer-events-none opacity-60": isFilesEmpty || !files?.files.filter((file) => file.fileType === fileType)
                                            })}
                                                onClick={() => selectAllFiles()}
                                            >
                                                {isAllSeleted ? (
                                                    <CircleCheck className="h-5 w-5 inline" />
                                                ) : selectedFiles.length === 0 ? (
                                                    <Circle className="h-5 w-5 inline" />
                                                ) : isPartialSelect ? (
                                                    <CircleMinus className="h-5 w-5 inline" />
                                                ) : (
                                                    <Circle className="h-5 w-5 inline" />
                                                )}

                                                <span className="inline pl-3">Select All</span>
                                            </li>
                                            <li className={cn("inline ml-10 p-3 cursor-pointer  hover:text-blue-500", {
                                                "pointer-events-none opacity-60": !isAnyFileSelected || selectedFiles.length === 0
                                            })}
                                            >
                                                <Dialog open={isOpen} onOpenChange={(visible) => {
                                                    if (!visible) {
                                                        setIsOpen(false)
                                                    }
                                                }}>
                                                    <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                                                        <span className="">Delete All</span>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        Do you want to delete all?
                                                        <div className="flex justify-around">
                                                            <Button
                                                                className="w-40"
                                                                onClick={() => {
                                                                    console.log("click confirm")
                                                                    deleteAllFiles()
                                                                    setIsOpen(false)
                                                                }}
                                                            >
                                                                Yes
                                                            </Button>
                                                            <Button
                                                                className="w-40"
                                                                onClick={() => {
                                                                    setIsOpen(false)
                                                                }}
                                                            >
                                                                No
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog >
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex justify-center">
                                        {isFilesDeleting ? (
                                            <span className="h-5 w-5">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            {/* Display all user files */}
                            {files && files.files && files.files?.length !== 0 ? (
                                <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 pl-3">
                                    {
                                        files?.files.filter((file) => file.fileType === 'pdf').length > 0 ? (files?.files.filter((file) => file.fileType === 'pdf').sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                                            .map((file) => (
                                                <li key={file.fileId} className={cn("relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg", {
                                                    "bg-blue-100": checkIsFileSelected(file)
                                                })}>
                                                    <span className="absolute left-2 top-2"
                                                        onClick={() => {
                                                            const newFiles = [...selectedFiles]
                                                            if (newFiles.includes(file)) {
                                                                newFiles.splice(newFiles.indexOf(file), 1)
                                                            } else {
                                                                newFiles.push(file)
                                                            }
                                                            if (files.files.length > newFiles.length) {
                                                                setIsPartialSeleted(true)
                                                                setIsAllSeleted(false)
                                                            } else if (files.files.length === newFiles.length) {
                                                                setIsPartialSeleted(false)
                                                                setIsAllSeleted(true)
                                                            }

                                                            setSelectedFiles(newFiles)
                                                        }}
                                                    >
                                                        {showSelectAll ?
                                                            selectedFiles.includes(file) ? (
                                                                <CircleCheck className="h-5 w-5" />
                                                            ) : (
                                                                <Circle className="h-5 w-5" />
                                                            ) : null
                                                        }

                                                        {/*  */}
                                                    </span>
                                                    <Link href={
                                                        selectedFiles.includes(file) ? {} :
                                                            file.fileType === "pdf" ? `/pdf-chat/${file.fileId}` : file.fileType === "text" ? `text-file-chat/${file.fileId}` : ""
                                                    }
                                                        className="flex flex-col gap-2"
                                                        onClick={() => setShowLoadingIcon(true)}
                                                    >
                                                        <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                                            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500' />
                                                            <div className='flex-1 truncate'>
                                                                <div className='flex items-center space-x-3'>
                                                                    <h3 className='truncate text-lg font-medium text-zinc-900'>{file.fileName}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="px-6 mt-4 grid grid-cols-4 place-items-center py-2 gap-6 text-xs text-zinc-500">
                                                        <div className="flex items-center gap-2">
                                                            <Plus className="h-4 w-4" />
                                                            {format(new Date(file.createdAt!), "MMM yyyy")}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Display file message count */}
                                                            <MessageSquare className="h-4 w-4" />
                                                            <span>{file.messages.length}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Download message in PDF */}
                                                            <Dialog open={isDownloadWindowOpen} onOpenChange={(visible) => {
                                                                if (!visible) {
                                                                    setIsDownloadWindowOpen(false)
                                                                }
                                                            }}>
                                                                <DialogTrigger>
                                                                    <Download className="h-4 w-4 cursor-pointer" onClick={
                                                                        () => {
                                                                            getAllFileMessages({ file: file })
                                                                        }}
                                                                    />
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
                                                        </div>

                                                        <Button
                                                            onClick={() => {
                                                                deleteFile({ id: file.fileId })
                                                            }}
                                                            disabled={selectedFiles.includes(file)}
                                                            size="sm" className="w-full" variant="destructive">
                                                            {currentlyDeletingFile === file.fileId ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : <Trash />}
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))) : (
                                            <h2 className="italic">No files found</h2>
                                        )
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
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="Text" className="bg-white px-10">
                        <AccordionTrigger className="hover:no-underline text-lg">Text Files</AccordionTrigger>
                        <AccordionContent>
                            <div className={cn("py-5 border-solid border-b-2", {
                                "hidden": !showSelectAll
                            })}>
                                <div className="grid grid-flow-row grid-cols-2 gap-4">
                                    <div>
                                        <ul className="">
                                            <li className={cn("inline bg-white p-3 rounded-full cursor-pointer", {
                                                "bg-slate-300": isAllSeleted,
                                                "pointer-events-none opacity-60": isFilesEmpty || !files?.files.filter((file) => file.fileType === "text")
                                            })}
                                                onClick={() => selectAllFiles()}
                                            >
                                                {isAllSeleted ? (
                                                    <CircleCheck className="h-5 w-5 inline" />
                                                ) : selectedFiles.length === 0 ? (
                                                    <Circle className="h-5 w-5 inline" />
                                                ) : isPartialSelect ? (
                                                    <CircleMinus className="h-5 w-5 inline" />
                                                ) : (
                                                    <Circle className="h-5 w-5 inline" />
                                                )}

                                                <span className="inline pl-3">Select All</span>
                                            </li>
                                            <li className={cn("inline ml-10 p-3 cursor-pointer  hover:text-blue-500", {
                                                "pointer-events-none opacity-60": !isAnyFileSelected || selectedFiles.length === 0
                                            })}
                                            >
                                                <Dialog open={isOpen} onOpenChange={(visible) => {
                                                    if (!visible) {
                                                        setIsOpen(false)
                                                    }
                                                }}>
                                                    <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                                                        <span className="">Delete All</span>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        Do you want to delete all?
                                                        <div className="flex justify-around">
                                                            <Button
                                                                className="w-40"
                                                                onClick={() => {
                                                                    console.log("click confirm")
                                                                    deleteAllFiles()
                                                                    setIsOpen(false)
                                                                }}
                                                            >
                                                                Yes
                                                            </Button>
                                                            <Button
                                                                className="w-40"
                                                                onClick={() => {
                                                                    setIsOpen(false)
                                                                }}
                                                            >
                                                                No
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog >
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex justify-center">
                                        {isFilesDeleting ? (
                                            <span className="h-5 w-5">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            {/* Display all user files */}
                            {files && files.files && files.files?.length !== 0 ? (
                                <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 pl-3">
                                    {
                                        files?.files.filter((file) => file.fileType === "text").length > 0 ? (files?.files.filter((file) => file.fileType === "text").sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                                            .map((file) => (
                                                <li key={file.fileId} className={cn("relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg", {
                                                    "bg-blue-100": checkIsFileSelected(file)
                                                })}>
                                                    <span className="absolute left-2 top-2"
                                                        onClick={() => {
                                                            const newFiles = [...selectedFiles]
                                                            if (newFiles.includes(file)) {
                                                                newFiles.splice(newFiles.indexOf(file), 1)
                                                            } else {
                                                                newFiles.push(file)
                                                            }
                                                            if (files.files.length > newFiles.length) {
                                                                setIsPartialSeleted(true)
                                                                setIsAllSeleted(false)
                                                            } else if (files.files.length === newFiles.length) {
                                                                setIsPartialSeleted(false)
                                                                setIsAllSeleted(true)
                                                            }

                                                            setSelectedFiles(newFiles)
                                                        }}
                                                    >
                                                        {showSelectAll ?
                                                            selectedFiles.includes(file) ? (
                                                                <CircleCheck className="h-5 w-5" />
                                                            ) : (
                                                                <Circle className="h-5 w-5" />
                                                            ) : null
                                                        }

                                                        {/*  */}
                                                    </span>
                                                    <Link href={
                                                        selectedFiles.includes(file) ? {} :
                                                            file.fileType === "pdf" ? `/pdf-chat/${file.fileId}` : file.fileType === "text" ? `text-file-chat/${file.fileId}` : ""
                                                    }
                                                        className="flex flex-col gap-2"
                                                        onClick={() => setShowLoadingIcon(true)}
                                                    >
                                                        <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                                                            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500' />
                                                            <div className='flex-1 truncate'>
                                                                <div className='flex items-center space-x-3'>
                                                                    <h3 className='truncate text-lg font-medium text-zinc-900'>{file.fileName}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="px-6 mt-4 grid grid-cols-4 place-items-center py-2 gap-6 text-xs text-zinc-500">
                                                        <div className="flex items-center gap-2">
                                                            <Plus className="h-4 w-4" />
                                                            {format(new Date(file.createdAt!), "MMM yyyy")}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Display file message count */}
                                                            <MessageSquare className="h-4 w-4" />
                                                            <span>{file.messages.length}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Download message in PDF */}
                                                            <Dialog open={isDownloadWindowOpen} onOpenChange={(visible) => {
                                                                if (!visible) {
                                                                    setIsDownloadWindowOpen(false)
                                                                }
                                                            }}>
                                                                <DialogTrigger>
                                                                    <Download className="h-4 w-4 cursor-pointer" onClick={
                                                                        () => {
                                                                            getAllFileMessages({ file: file })
                                                                        }}
                                                                    />
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
                                                        </div>

                                                        <Button
                                                            onClick={() => {
                                                                deleteFile({ id: file.fileId })
                                                            }}
                                                            disabled={selectedFiles.includes(file)}
                                                            size="sm" className="w-full" variant="destructive">
                                                            {currentlyDeletingFile === file.fileId ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : <Trash />}
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))) : (
                                            <h2 className="italic">No files found</h2>
                                        )
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


            </main>
            {
                showLoadingIcon ? (
                    <div className="page-loader absolute w-80 h-60 top-0 left-0 right-0 bottom-0 m-auto">
                        <div className="loader-bg absolute w-full h-full top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-50 rounded-md" />
                        <PageLoader className="absolute top-0 bottom-0 left-0 right-0" />
                    </div>
                ) : null
            }
        </>
    )
}

export default Dashboard