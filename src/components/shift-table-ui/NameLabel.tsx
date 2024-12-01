'use client'
import { ComponentProps, useEffect, useState } from "react";
import { ButtonProps } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import AvailSqaure from "./AvailSquare";
import { createClient } from "@/utils/supabase/client";

interface Props {
    onToggle: (enabled: boolean) => void
    name: string,
    userId: string,
    businessId: string,

}


export default function NameLabel({onToggle,name,businessId,userId}: Props){
    const supabase = createClient()

    const [enabled,setEnabled] = useState<boolean>(true)

    useEffect(() => {
        
        onToggle(enabled)

    },[enabled])

    const [availability,setAvailability] = useState<Availability>({
        sunday: {from: '',to: '', enabled: false},
        monday: {from: '',to: '', enabled: false},
        tuesday: {from: '',to: '', enabled: false},
        wednesday: {from: '',to: '', enabled: false},
        thursday: {from: '',to: '', enabled: false},
        friday: {from: '',to: '', enabled: false},
        saturday: {from: '',to: '', enabled: false},
    })

    useEffect(() => {
        supabase.from('availability').select().eq('business_id',businessId).eq('user_id',userId)
        .then(res => {
            if(res.error) {
                console.error(res.error.message)
                return
            }

            setAvailability(res.data[0])
        })
    },[])

    


    return <>
    
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <div onClick={(e) => {setEnabled(prev => !prev)}} className={`bg-black p-2 rounded-md hover:line-through hover:cursor-pointer ${!enabled && 'line-through opacity-50'}`}>{name}</div>
                </TooltipTrigger>

                <TooltipContent className="border-none bg-black text-white flex flex-col items-center w-[200px]">
                    <span> {`${name.split(' ')[0]}'s`} Availability</span>

                    <div className="flex w-full h-6 gap-1">
                        <AvailSqaure enabled={availability.sunday.enabled} from={availability.sunday.from} to={availability.sunday.to}>S</AvailSqaure>
                        <AvailSqaure enabled={availability.monday.enabled} from={availability.monday.from} to={availability.monday.to}>M</AvailSqaure>
                        <AvailSqaure enabled={availability.tuesday.enabled} from={availability.tuesday.from}  to={availability.tuesday.to}>T</AvailSqaure>
                        <AvailSqaure enabled={availability.wednesday.enabled} from={availability.tuesday.from} to={availability.wednesday.to}>W</AvailSqaure>
                        <AvailSqaure enabled={availability.thursday.enabled} from={availability.thursday.from} to={availability.thursday.to}>TH</AvailSqaure>
                        <AvailSqaure enabled={availability.friday.enabled} from={availability.friday.from} to={availability.friday.to}>F</AvailSqaure>
                        <AvailSqaure enabled={availability.saturday.enabled} from={availability.saturday.from} to={availability.saturday.to}>SA</AvailSqaure>

                    </div>
                    
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    
    </>
}

interface Availability {
    sunday: {from: string,to: string, enabled: boolean},
    monday: {from: string,to: string, enabled: boolean},
    tuesday: {from: string,to: string, enabled: boolean},
    wednesday: {from: string,to: string, enabled: boolean},
    thursday: {from: string,to: string, enabled: boolean},
    friday: {from: string,to: string, enabled: boolean},
    saturday: {from: string,to: string, enabled: boolean},
}