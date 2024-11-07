import { ComponentProps, useState } from "react";
import { ButtonProps } from "../ui/button";




interface Props {
    onToggle: () => void
    name: string
}


export default function NameLabel({onToggle,name}: Props){

    const [enabled,setEnabled] = useState<boolean>(true)

    


    return <>
    
        <div onClick={(e) => {setEnabled(prev => !prev); onToggle()}} className={`bg-black p-2 rounded-md hover:line-through hover:cursor-pointer ${!enabled && 'line-through opacity-50'}`}>{name}</div>
    
    </>
}