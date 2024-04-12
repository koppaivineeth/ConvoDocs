"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { buttonVariants } from './ui/button'
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
/**
 * 
 * TODO: OPtion to upload PDF, normal text file
 * DASHBOARD contains all types of file,
 * click of file will decide the type and go to pdf or text file chat
 * route for both pdf chat and text chat
 */
const ToolsNav = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleOpen = () => setIsOpen((prev: boolean) => !prev)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <span className="font-medium text-sm">Tools</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link
                        onClick={() => toggleOpen()}
                        href='/pdf-chat/1'
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                        })}>
                        Chat with PDF
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href='/text-file-chat/1'
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'sm',
                        })}>
                        Chat with Text file
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ToolsNav
