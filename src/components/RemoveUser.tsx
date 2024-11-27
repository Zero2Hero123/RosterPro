'use client'

import { Tooltip, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { UserRoundX } from "lucide-react";
import { Button } from "./ui/button";
import { TooltipContent } from "./ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "./ui/use-toast";


interface Props {
    businessId: string
    name: string
    userId: string
}
// button that removed a user from an organization

export default function RemoveUser({businessId,userId,name}: Props){

    const supabase = createClient()

    const {toast} = useToast()


    function removeUserFromOrganization(userId: string){
        supabase.from('user_businesses').delete().eq('business_id',businessId).eq('user_id',userId)
            .then((res) => {
                if(res.error){
                    console.error(res.error.message)
                    return
                } else {
                    toast({
                        title: `Successfully removed ${name}`
                    })
                }
            })
    }



    return <>
    
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={() => removeUserFromOrganization(userId)} variant={'outline'}>
                    <UserRoundX/>
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                {`Remove ${name}`}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    
    
    </>
}