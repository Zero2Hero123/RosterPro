'use client'
import { UserRoundPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";

import { Resend } from 'resend'
import { createClient } from "@/utils/supabase/server";
import { usePathname, useRouter } from "next/navigation";
import { sendEmail } from "@/utils/actions";
import { useRef } from "react";
import { useToast } from "../ui/use-toast";

interface Props {
    businessName: string
    businessId: string
}


export default function Invite({businessName,businessId}: Props){

    const emailInput = useRef<HTMLInputElement>(null)

    const { toast } = useToast()
    
    function notify(){
        console.log('NOTIFY')
        if(emailInput.current){
            emailInput.current.value = ''
        }

        toast({
            title: "Success!",
            description: 'Invite Sent!',
        })
    }

    return (<>

        <Dialog>
            <DialogTrigger asChild>
                <Button className="absolute rounded-full bottom-10 right-10 flex justify-center items-center bg-white text-black hover:bg-slate-200 h-14 w-14"><UserRoundPlus size={30} /> </Button>
            </DialogTrigger>

            <DialogContent className="bg-black">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center"> <UserRoundPlus size={15} />  Send Invite</DialogTitle>
                </DialogHeader>
                <form action={sendEmail} method="POST" className="flex gap-3">
                    <input className="hidden" name="bizName" value={businessName} />
                    <input className="hidden" name="bizId" value={businessId} />


                    <Input ref={emailInput} name="email" required className="bg-black" placeholder="Email" type='email' />
                    <Button onClick={notify} type="submit" className="bg-white text-black hover:bg-slate-300">Send</Button>
                </form>
            </DialogContent>

        </Dialog>
    
    
        
    
    
    
    </>)
}