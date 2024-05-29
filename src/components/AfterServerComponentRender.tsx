"use client"

import { useEffect } from "react"
import { useMediaQuery } from 'react-responsive'

interface PageProps {
    hideBodyScroll: boolean
}
const AfterServerComponentRender = ({ hideBodyScroll }: PageProps) => {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    useEffect(() => {
        if (hideBodyScroll && isDesktopOrLaptop)
            document.getElementsByTagName('body')[0].style.overflow = 'hidden'
        else
            document.getElementsByTagName('body')[0].style.overflow = 'auto'
    })
    return <></>
}

export default AfterServerComponentRender