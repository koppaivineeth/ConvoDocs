"use client"

import { trpc } from "@/app/_trpc/client"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { ArrowDown } from "lucide-react"
import NotesPDFDOC from "@/lib/createNotesPDF"
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { cn } from "@/lib/utils"

interface NotesProps {
    fileId: string,
    fileName: string
}
const formSchema = z.object({
    notes: z.string()
})
const NotesInput = ({ fileId, fileName }: NotesProps) => {

    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isDownloadWindowOpen, setIsDownloadWindowOpen] = useState<boolean>(false)
    const [isNotesEmpty, setIsNotesEmpty] = useState<boolean>(true)

    const { mutate: saveNotesFromPDF } = trpc.saveNotesFromPDF.useMutation({
        onMutate: () => {
            setIsSaving(true)
        },
        onSuccess: () => {
            setIsSaving(false)
        },
        onSettled: () => {
            alert("Notes saved !")
            setIsSaving(false)
            setIsNotesEmpty(false)
        }
    })
    const { data: savedNotes } = trpc.retrieveSavedNotes.useQuery({ fileId })
    const { data: refetchedNotes, error, refetch } = trpc.retrieveSavedNotes.useQuery({ fileId })

    const { mutate: deleteAllNotes } = trpc.deleteAllNotes.useMutation({
        onMutate: () => {
            setIsSaving(false)
            setIsDeleting(true)
        },
        onSuccess: () => {
            setIsDeleting(false)
            setIsNotesEmpty(true)
            alert("All notes deleted !")
        },
        onSettled: () => {
            setIsDeleting(false)
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        saveNotesFromPDF({ notes: values.notes, fileId })
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            notes: ""
        },
        values: {
            notes: savedNotes?.notes!
        }
    })

    return (
        <div className="relative">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea rows={1}
                                        maxRows={4}
                                        autoFocus
                                        placeholder="Enter your notes here ..."
                                        className="pr-12 text-base py-3 min-h-80 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between mt-3">
                        <div className="download-notes flex justify-start">

                            <Dialog open={isDownloadWindowOpen} onOpenChange={(visible) => {
                                if (!visible) {
                                    setIsDownloadWindowOpen(false)
                                }
                            }}>
                                <DialogTrigger onClick={() => setIsDownloadWindowOpen(true)} disabled={isNotesEmpty}>
                                    <Button type="button"
                                        disabled={isNotesEmpty}
                                        onClick={() => {
                                            refetch()
                                        }}
                                    >
                                        Download
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>

                                    <div>
                                        <span>You can download all the notes!</span>
                                        <div className="flex justify-between mt-5">
                                            <PDFDownloadLink document={<NotesPDFDOC notes={refetchedNotes} fileName={fileName} />}>
                                                <Button type="button">
                                                    Download Now
                                                </Button>
                                            </PDFDownloadLink>
                                            <Button className="bg-slate-500 hover:bg-slate-700" onClick={() => setIsDownloadWindowOpen(false)}>Cancel</Button>
                                        </div>
                                    </div>


                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="mr-5 min-w-28">
                                {
                                    isSaving && !isDeleting ? "Saving" : "Save Notes"
                                }
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    form.reset()
                                    // form.setValue("notes", "")
                                    deleteAllNotes({ fileId })
                                }}
                                className="bg-red-600 hover:bg-red-500 min-w-28"
                            >
                                {isDeleting ? "Deleting" : "Clear Notes"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

        </div>

    )
}

export default NotesInput