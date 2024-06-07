import BillingForm from "@/components/BillingForm"
import { db } from "@/db"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import PageLoader from "@/components/PageLoader"

const Page = async () => {

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id) redirect("/auth-callback?origin=dashboard")

    const dbuser = db.users.findFirst({
        where: {
            userId: user?.id
        }
    })
    if (!dbuser) redirect("/auth-callback?origin=dashboard")

    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <Suspense fallback={<PageLoader />}>
            <BillingForm subscriptionPlan={subscriptionPlan} />
        </Suspense>
    )
}

export default Page