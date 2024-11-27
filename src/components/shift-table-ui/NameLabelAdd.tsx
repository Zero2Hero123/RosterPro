import { ComponentProps, useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Plus } from "lucide-react";




interface Props {
    
}


export default function NameLabelAdd({}: Props){
    


    return <>
    
        <Button disabled className="bg-transparent hover:bg-slate-600 border border-dashed border-white text-white"> <Plus/> </Button>
    
    </>
}