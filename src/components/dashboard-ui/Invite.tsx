import { UserRoundPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";









export default async function Invite(){


    return (<>

        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex justify-between bg-slate-950 h-9 my-4"><UserRoundPlus size={15} />  <span className="grow text-center">Invite</span> </Button>
            </DialogTrigger>

            <DialogContent className="bg-black">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center"> <UserRoundPlus size={15} />  Send Invite</DialogTitle>
                </DialogHeader>
                <form action={'#'} method="POST" className="flex gap-3">
                    <Input required autoFocus className="bg-black" placeholder="Email" type='email' />
                    <Button type="submit" className="bg-white text-black hover:bg-slate-300">Send</Button>
                </form>
            </DialogContent>

        </Dialog>
    
    
        
    
    
    
    </>)
}