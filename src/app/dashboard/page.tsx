// "use client"

import excuteQuery from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import Dashboard from "@/components/Dashboard"

const Page = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) redirect("/auth-callback?origin=dashboard")

    const dbUser = await excuteQuery({
        query: "SELECT * FROM users WHERE userId = ?",
        values: [user.id]
    })
    if (dbUser.length === 0) redirect("/auth-callback?origin=dashboard")



    return <Dashboard />
}

export default Page