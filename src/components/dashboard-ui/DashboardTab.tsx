import { ComponentProps, PropsWithChildren } from "react"
import { Button } from "../ui/button"
import Link, { LinkProps } from "next/link"
import { redirect, usePathname, useRouter } from "next/navigation"


type Props = PropsWithChildren & LinkProps

export default function DashboardTab({children,href}: Props){

    const path = usePathname()

    const router = useRouter()

    return <>
    
        <Button onClick={() => router.push(href.toString())} className={" hover:bg-[#333333] flex "+(href == path ? 'bg-[#333333]': 'bg-black')}> {children} </Button>
    
    </>
}