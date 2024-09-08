'use client'

import Message from "@/components/dashboard-ui/chat/Message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"




interface Props {
    params: {id: string}
}



export default function Chat({ params }: Props){

    const supabase = createClient()

    const [business,setBusiness] = useState<any | null>(null)

    useEffect(() => {
        supabase.from('business').select().eq('id',params.id)
        .then(({data,error}) => {
            setBusiness(data && data[0])

            if(error) console.warn(error)
        })
    },[])


    // TODO add sendMessage server action
    return <>
    
        <header>
            {business ? <span className="text-3xl font-bold ">{business.name}</span> : <Skeleton className="h-[36px] w-[300px]" />}
        </header>
        <section className="bg-[#333333] h-[81vh] md:h-[85vh] w-[100%] flex flex-col">

            <div className="flex flex-col-reverse grow p-2">
                <Message/>
            </div>
            
            <form className="w-[100%] h-16 flex items-center p-2 gap-1">
                <Input min={2} autoFocus name="message-content" className="bg-black border-gray-600 text-white w-[100%] dark" placeholder="Type a message" type="text" />
                <Button className="bg-white text-black hover:bg-slate-300 hover:text-black h-10" type="submit">Send</Button>
            </form>
        </section>
    
    </>
}