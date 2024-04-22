"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../app/_trpc/client"

const UseSearchParam = () => {
    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')
    const { data, error } = trpc.authCallback.useQuery(undefined)
    if (data?.success) {
        router.push(origin ? `/${origin}` : "/dashboard");
    } else if (error?.data?.code === "UNAUTHORIZED") {
        router.push("/api/auth/login");
    }

    return <></>
}

export default UseSearchParam