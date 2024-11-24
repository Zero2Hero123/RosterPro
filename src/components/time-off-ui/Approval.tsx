'use client'

import { Check, CircleOff, X } from "lucide-react"
import { Button } from "../ui/button"
import { createClient } from "@/utils/supabase/client"
import { useTransition } from "react"


interface Props {
    requestId: string // time off request id
}

export default function Approval({requestId}: Props){

    const supabase = createClient()

    const [isPending,startTransition] = useTransition()
    

    function approve(){

        startTransition(() => {
            supabase.from('time_off_request').update({
                approved: true
            }).eq('id',requestId)
            .then(res => {
                if(res.error){
                    console.error(res.error)
                }
            })
        })
        
    }

    function deny(){
        
        startTransition(() => {
            supabase.from('time_off_request').update({
                approved: false
            }).eq('id',requestId)
            .then(res => {
                if(res.error){
                    console.error(res.error)
                }
            })
        })

    }

    
    return <>
        <div className="flex gap-1">
            <Button disabled={isPending} onClick={approve} variant={'outline'} className=" w-10 h-8" size={'icon'}> <Check /></Button>
            <Button disabled={isPending} onClick={deny} variant={'outline'} className=" w-10 h-8" size={'icon'}> <CircleOff/></Button>
        </div>
    </>
}