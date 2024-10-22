'use client'

import { requestTimeOff } from "@/utils/actions";
import DatePicker from "./DatePicker";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


interface Props {
    businessId: string
}

const initState = {
    message: ''
}


export default function TimeOffRequestForm({businessId}: Props){

    const [state,action] = useFormState(requestTimeOff,initState)

    const status = useFormStatus()
    const router = useRouter()

    const {toast} = useToast()

    useEffect(() => {
        if(state.message != ''){
            toast({
                title: 'Time Off Request Submitted',
                description: state.message
            })
        }
    },[state])


    return <>
    
    <form action={action} className="flex flex-col items-center gap-2">
        <span>How many days?</span>
        <DatePicker/>
        <Input className="hidden" name="business_id" value={businessId} />

        <Textarea name="reason" className="bg-black text-white" placeholder="Reason" />
        <Button disabled={status.pending} type="submit" className="bg-white text-black hover:bg-slate-200 w-16">Submit</Button>
    </form>
    
    </>
}