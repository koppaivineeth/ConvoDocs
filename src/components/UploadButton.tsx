"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import Dropzone from "react-dropzone"
import { Cloud, File, Loader2 } from "lucide-react"
import { Progress } from "./ui/progress"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "./ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"

const UploadDropzone = ({
    isSubscribed,
    fileType
}: {
    isSubscribed: boolean
    fileType: string
}) => {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [uploadError, setUploadError] = useState<boolean>(false)

    const { toast } = useToast()
    const { startUpload } = useUploadThing(
        isSubscribed ? "proPlanUploader" : "freePlanUploader"
    )

    const { mutate: startPolling } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            if (file.fileType === "pdf")
                router.push(`/pdf-chat/${file.fileId}`)
            else
                router.push(`/text-file-chat/${file.fileId}`)
        },
        retry: true,
        retryDelay: 500
    })

    const startSimulatedProgress = () => {
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval)
                    return prevProgress
                }
                return prevProgress + 5
            })
        }, 500)

        return interval
    }

    return (
        <Dropzone
            multiple={false}
            onDrop={async (acceptedFile) => {
                console.log("Upload file type = ", fileType)
                setUploadError(false)
                let displayType = fileType.includes("pdf") ? "PDF" : fileType.includes("text") ? "text" : fileType
                if (!acceptedFile[0]?.type.includes(fileType) && fileType !== "all") {
                    debugger
                    setUploadError(true)
                    return toast({
                        title: "Something went wrong !",
                        description: `You have not choosen ${displayType} file`,
                        variant: "destructive"
                    })
                }
                setIsUploading(true)
                const progressInterval = startSimulatedProgress()
                //handle file uploading
                const res = await startUpload(acceptedFile)
                if (!res) {
                    setUploadProgress(100)
                    setUploadError(true)
                    return toast({
                        title: "Something went wrong !",
                        description: "Please check the file type and size and try again",
                        variant: "destructive"
                    })
                }

                const [fileResponse] = res

                const key = fileResponse?.key

                if (!key) {
                    return toast({
                        title: "Something went wrong !",
                        description: "Please try again later",
                        variant: "destructive"
                    })
                }



                clearInterval(progressInterval)
                setUploadProgress(100)

                startPolling({ key })
            }}>
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
                    <div className='flex items-center justify-center h-full w-full'>
                        <label
                            htmlFor='dropzone-file'
                            className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span> {' '}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-zinc-500">{fileType.includes("pdf") ? "PDF" : fileType.includes("text") ? "Text" : "PDF/Text"} file (up to {isSubscribed ? "16" : "4"} MB)</p>
                            </div>
                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                    <div className="px-3 py-2 h-full grid place-items-center">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="px-3 py-2 h-full text-sm truncate">
                                        {acceptedFiles[0].name}
                                    </div>
                                </div>
                            ) : null}

                            {isUploading ? (
                                <div className="w-full mt-4 max-w-xs mx-auto">
                                    <Progress
                                        value={uploadProgress}
                                        className="h-1 w-full bg-zinc-200"
                                        indicatorColor={
                                            uploadError ? 'bg-red-500' :
                                                (uploadProgress === 100 ? 'bg-green-500' : '')
                                        }
                                    />
                                    {uploadProgress === 100 && !uploadError ? (
                                        <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                                            <Loader2 className='h-3 w-3 animate-spin' />
                                            Redirecting...
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            <input
                                {...getInputProps()}
                                type="file"
                                id="dropzone-file"
                                className="hidden"
                                onClick={e => e.preventDefault()}
                            />
                        </label>
                    </div>
                </div>
            )}
        </Dropzone>)
}
const UploadButton = ({
    isSubscribed,
    buttonClass,
    elementType,
    uploadButtonText,
    fileType
}: {
    isSubscribed: boolean
    buttonClass?: string
    elementType: string
    uploadButtonText?: string
    fileType: string
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={(visible) => {
            if (!visible) {
                setIsOpen(visible)
            }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                {
                    elementType === 'button' ? (
                        <Button className={buttonClass}>{uploadButtonText ? uploadButtonText : "Upload PDF/Text"}</Button>
                    ) : elementType === 'link' ? (
                        <span className="cursor-pointer underline mt-5">{uploadButtonText ? uploadButtonText : "Upload PDF/Text"}</span>
                    ) : null
                }
            </DialogTrigger>
            <DialogContent>
                <UploadDropzone isSubscribed={isSubscribed} fileType={fileType} />
            </DialogContent>
        </Dialog >
    )
}

export default UploadButton