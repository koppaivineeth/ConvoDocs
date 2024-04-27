"use client"

import { SquareX, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactNode, useState } from "react"
import Image from "next/image"
import chooseFile from "../../public/select_file_button.png"

interface PageProps {
    children: ReactNode
}
const SideBar = ({ children }: PageProps) => {

    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)
    return (
        <>
            <div className={cn("absolute cursor-pointer z-10 top-1/2 transform -translate-y-1/2", {
                "hidden": isSideBarOpen
            })}
                onClick={() => setIsSideBarOpen((prev) => !prev)}>
                <span>
                    <Image className="w-6 h-20 rounded-tr-sm rounded-br-sm hover:h-24 transition-all" src={chooseFile} alt="choose file" />
                </span>
            </div>
            <div className={cn(
                `hidden select-none collapsible-sidebar h-[calc(100vh-3.5rem)] max-h-full w-60 absolute bg-blue-600 border-r-4 border-l-0 border-z z-10 p-5 text-blue-50`, {
                "block": isSideBarOpen
            })}>
                <div className="close-button flex justify-end static">
                    <SquareX className="w-4 h-4 cursor-pointer"
                        onClick={() => setIsSideBarOpen((prev) => !prev)}
                    />
                </div>
                <div className="p-3 title text-center mt-5 mb-5 static text-lg">
                    <span>
                        Choose a file
                    </span>
                </div>
                <div className="file-list flex justify-center overflow-auto h-[calc(100vh-14rem)] pb-3">
                    {
                        children ? (
                            children
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}

export default SideBar