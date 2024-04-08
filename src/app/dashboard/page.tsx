// "use client"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"
import { db } from "@/db"

const Page = async () => {
    console.log("DASHBOARD PAGE = ")
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    console.log("DASHBOARD PAGE USER = ", user)

    if (!user || !user.id) redirect("/auth-callback?origin=dashboard")

    const dbUser = await db.users.findFirst({
        where: {
            userId: user.id
        }
    })
    console.log("DASHBOARD DBUSER = ", dbUser)

    if (!dbUser) redirect("/auth-callback?origin=dashboard")



    return <Dashboard />
}

export default Page