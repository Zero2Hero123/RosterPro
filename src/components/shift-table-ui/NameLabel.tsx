'use client'
import { ComponentProps, useEffect, useState } from "react";
import { ButtonProps } from "../ui/button";

interface Props {
    onToggle: (enabled: boolean) => void
    name: string
}


export default function NameLabel({onToggle,name}: Props){

    const [enabled,setEnabled] = useState<boolean>(true)

    useEffect(() => {
        
        onToggle(enabled)

    },[enabled])

    


    return <>
    
        <div onClick={(e) => {setEnabled(prev => !prev)}} className={`bg-black p-2 rounded-md hover:line-through hover:cursor-pointer ${!enabled && 'line-through opacity-50'}`}>{name}</div>
    
    </>
}