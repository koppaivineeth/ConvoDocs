// "use client"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"
import { db } from "@/db"
import { getUserSubscriptionPlan } from "@/lib/stripe"

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

    return <Dashboard subscriptionPlan={subscriptionPlan} />
}

export default Page