// "use client"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"
import { db } from "@/db"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { Suspense } from "react"
import PageLoader from "@/components/PageLoader"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const Page = async () => {

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) redirect("/auth-callback?origin=dashboard")

    const dbUser = await db.users.findFirst({
        where: {
            userId: user.id
        }
    })
    if (!dbUser) redirect("/auth-callback?origin=dashboard")

    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <>
            <Suspense fallback={<PageLoader />}>
                <div className="grid-container select-none flex h-screen m-auto justify-center items-center w-full gap-20">
                    <div className="pdf-page-link text-center w-full flex justify-end h-48">
                        <Link href='/pdf-chat' className="w-1/2 p-10 relative bg-blue-400 text-white cursor-pointer rounded-md hover:bg-blue-500 group">
                            <span className="absolute w-fit h-fit top-0 bottom-0 left-0 right-0 m-auto text-2xl">
                                Chat with PDF
                                <ArrowRight className='h-10 w-10 m-auto  group-hover:animate-bounce-right' />
                            </span>
                        </Link>
                    </div>
                    <div className="textfile-page-link text-center w-full flex justify-start h-48">
                        <Link href='/text-file-chat' className="w-1/2 p-10 relative bg-blue-400 text-white cursor-pointer rounded-md hover:bg-blue-500 group">
                            <span className="absolute w-fit h-fit top-0 bottom-0 left-0 right-0 m-auto text-2xl">
                                Chat with Text
                                <ArrowRight className='h-10 w-10 m-auto group-hover:animate-bounce-right' />
                            </span>
                        </Link>
                    </div>
                </div>
            </Suspense>
        </>
    )
}

export default Page