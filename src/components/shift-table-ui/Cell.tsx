'use client'

import { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
    children?: ReactNode
}

const Cell: React.FC<Props> = ({children}) => {

    const [isEditing,setIsEditing] = useState(false)
    const userInput = useRef<HTMLInputElement>(null)

    const [content,setContent] = useState(children?.toString().replaceAll(',','')) 

    useEffect(() => {
        if(isEditing){
            if(userInput.current){
                userInput.current.focus()
            }
        }

        if(userInput.current){
            userInput.current.addEventListener('focusout', () => {
                setIsEditing(false)
            })
        }

        return () => {
            if(userInput.current){
                userInput.current.removeEventListener('focusout', () => {
                    setIsEditing(false)
                })
            }
        }
    },[isEditing])

    // data-swapy-slot={index}

    return <div onClick={() => setIsEditing(true)} className="hover:cursor-text border text-black flex items-center justify-center h-6">
        {isEditing ? <input onKeyDown={(k) => k.code === 'Enter' && setIsEditing(false) } placeholder={content?.toString()} ref={userInput} onChange={(e) => setContent(e.target.value)} className="grow w-16 h-6 focus:outline-dashed p-0 m-0 text-center" type="text"/> : content}
    </div>
}


export default Cell;