"use client"

import { useEffect } from "react"

interface PageProps {
    hideBodyScroll: boolean
}
const AfterServerComponentRender = ({ hideBodyScroll }: PageProps) => {

    useEffect(() => {
        if (hideBodyScroll)
            document.getElementsByTagName('body')[0].style.overflow = 'hidden'
        else
            document.getElementsByTagName('body')[0].style.overflow = 'auto'
    })
    return <></>
}

export default AfterServerComponentRender