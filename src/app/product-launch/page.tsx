"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Rocket } from "lucide-react"
import { useState } from "react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required"
    }),
    message: z.string().optional()
})
const Page = () => {
    const [isSending, setIsSending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            message: ""
        },
    })
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)

        setIsSending(true)
        fetch('/api/email-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then((data) => {
            setIsSuccess(data.ok)
            setIsSending(false)
            form.reset()
        }).catch((error) => {
            console.log(error)
            setIsSuccess(false)
        })
    }

    return (
        <div className="m-auto w-1/2 h-fit p-10 pt-0 border bg-white select-none mt-16 mb-16">
            <span className="bg-green-300 p-1 font-semibold text-sm rounded-b-sm">
                <Rocket className="w-4 h-4 inline mr-3" />
                Launching soon
            </span>
            <h1 className="text-3xl pb-7 text-center mt-10">
                Get ready for greatness!
            </h1>

            <div className="text-center">
                <span className="italic">
                    Join our mailing list to stay in the loop about our upcoming launch. Don&apos;t miss your chance to be part of the journey from the beginning.
                </span>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="Email address" className="mb-2 mt-5 ml-auto mr-auto w-4/5" />
                                        </FormControl>
                                        <div className="error-message h-4 w-4/5 text-left ml-auto mr-auto">
                                            <FormMessage className="text-red-600 text-[10px] italic w-4/5" />
                                        </div>
                                    </FormItem>

                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea minRows={4} {...field} placeholder="Any message you want to share? (Optional)" className="mb-5 mt-5 ml-auto mr-auto w-4/5" />
                                        </FormControl>
                                        <div className="error-message h-4">
                                            <FormMessage className="text-red-600 text-[10px] italic" />
                                        </div>
                                    </FormItem>

                                )}
                            />
                        </div>
                        <Button type="submit" className="mb-5 w-4/5">
                            {isSending ? (
                                <span>Subscribing <Loader2 className="h-4 w-4 inline-block animate-spin" /></span>
                            ) : (
                                <label htmlFor="">Subscribe</label>
                            )}
                        </Button>
                    </form>
                </Form>
                <p className="text-green-700">
                    {isSuccess && <span>Saved, we will notify you as soon as the product is live!</span>}
                </p>
            </div>
        </div>
    )
}

export default Page
