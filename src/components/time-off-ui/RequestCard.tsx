'use client'

import { formatDate } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Approval from "./Approval";
import { Check, Clock, Ellipsis } from "lucide-react";

import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";


interface Props {
    t: any // time off request
}


export default function RequestCard({t}: Props){

    const supabase = createClient()

    const [requestee,setRequestee] = useState<any | null>(null)

    const toast = useToast()
    const router = useRouter()

    useEffect(() => {
        supabase.from('profiles').select().eq('id',t.user_id)
            .then(res => {
                if(res.error){
                    console.error(res.error)
                    return
                }

                setRequestee(res.data[0])
            })

        const changes = supabase.channel('table-db-changes').on('postgres_changes',{schema: 'public',event: 'UPDATE',table: 'time_off_request'}, data => {
            if(data.new.id == t.id){
                setApproved(data.new.approved)
            }
        }).subscribe()

        return () => {
            changes.unsubscribe()
        }
    },[])

    function deleteTimeOff(){
        supabase.from('time_off_request').delete().eq('id',t.id)
        .then(res => {
            if(res.error){
                console.error(res.error.message)
            } else {
                toast.toast({
                    title: `Successfully Deleted Time Off Request`,
                    description: `${formatDate(t.from,'MMMM dd, yyyy')} to ${formatDate(t.to,'MMMM dd, yyyy')}`
                })

                router.refresh()
            }
        })
    }

    const [isApproved,setApproved] = useState<'APPROVED' | 'AWAITING' | 'DENIED'>(t.approved)
    

    return <>
    
        <Card className="pt-3 px-1 h-40 relative" key={`TIME_OFF_${t.id}`}>
            {requestee ? <CardTitle className="font-medium flex justify-between pr-3">
                <span>{requestee.first_name} {requestee.last_name}</span>
                
                <Popover>
                    <PopoverTrigger asChild>
                        {requestee.id == t.user_id && <Button size='icon' variant={'ghost'}><Ellipsis/></Button>}
                    </PopoverTrigger>

                    <PopoverContent className="bg-black bg-opacity-50 border-none w-auto">
                        <Button onClick={deleteTimeOff} variant={'destructive'}>Delete</Button>
                    </PopoverContent>
                </Popover>


                </CardTitle> : <Skeleton className="h-6 m-1"/>}
            
            <CardContent>{formatDate(t.from,"MMMM dd, yyyy")} to {formatDate(t.to,"MMMM dd, yyyy")}</CardContent>
            <CardFooter className="flex justify-between">
                {isApproved == 'APPROVED' && <Badge variant={'outline'}><Check size={14}/>Approved</Badge>}
                {isApproved == 'AWAITING' && <Badge className="flex gap-1" variant={'secondary'}> <Clock size={14}/> Awaiting Approval</Badge>}
                {isApproved == 'DENIED' && <Badge className="flex gap-1" variant={'secondary'}> Denied</Badge>}
                {isApproved == 'AWAITING' && <Approval setApproved={setApproved} requestId={t.id}/>}
            </CardFooter>
        </Card>
    
    </>
}