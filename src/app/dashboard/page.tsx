import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"
import { db } from "@/db"
import { getUserSubscriptionPlan } from "@/lib/stripe"
import { Suspense } from "react"
import PageLoader from "@/components/PageLoader"
import AfterServerComponentRender from "@/components/AfterServerComponentRender"
import Footer from "@/components/Footer"

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
                <AfterServerComponentRender hideBodyScroll={false} />
                <Dashboard subscriptionPlan={subscriptionPlan} fileType="all" uploadFileType="application/pdf" customClass="mb-20" />
            </Suspense>

            {/* Footer section */}
            <Footer customClass="px-20 bg-white" />
        </>
    )
}

export default Page