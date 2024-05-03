"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { trpc } from "../_trpc/client"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name is required"
    }),
    lastName: z.string().min(1, {
        message: "Last name is required"
    }),
    email: z.string().email().min(1, {
        message: "Email is required"
    }),
    message: z.string().min(1, {
        message: "Please enter some message"
    })
})


const Page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            message: ""
        },
    })
    const [isSending, setIsSending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showMessage, setShowMessage] = useState(false)

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSending(true)
        fetch('/api/contact-us', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then((data) => {
            setIsSuccess(data.ok)
            setIsSending(false)
            setShowMessage(true)
            form.reset()
        })
    }
    return (
        <>
            <div className="text-center">
                <span>Contact Us </span>
            </div>
            <div className="contact-form mt-4 w-fit h-fit m-auto p-5 max-w-2xl select-none bg-zinc-200 rounded-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                        <div className="grid grid-cols-2 gap-5 mb-10">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="John" />
                                        </FormControl>
                                        <div className="error-message h-4">
                                            <FormMessage className="text-red-600 text-[10px] italic" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Will" />
                                        </FormControl>
                                        <div className="error-message h-4">
                                            <FormMessage className="text-red-600 text-[10px] italic" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-10">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="john.will@gmail.com" />
                                        </FormControl>
                                        <div className="error-message h-4">
                                            <FormMessage className="text-red-600 text-[10px] italic" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mb-10">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your message</FormLabel>
                                        <FormControl>
                                            <Textarea minRows={4} {...field} placeholder="Message" />
                                        </FormControl>
                                        <div className="error-message h-4">
                                            <FormMessage className="text-red-600 text-[10px] italic" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full flex m-auto">

                            {isSending ? (
                                <span>Submitting <Loader2 className="h-4 w-4 inline-block animate-spin" /></span>
                            ) : (
                                <label htmlFor="">Sumbit</label>
                            )}
                        </Button>
                    </form>
                </Form>
                <div className={cn("text-sm italic pt-5 min-h-11 text-center", {
                    "text-red-600": !isSuccess,
                    "text-green-600": isSuccess
                })}>
                    {
                        showMessage && !isSuccess ? (
                            <span>Could not send message, please try again</span>
                        ) : showMessage && isSuccess ? (
                            <span>Message sent successfully !</span>
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}

export default Page
