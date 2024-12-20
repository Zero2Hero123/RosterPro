'use client'
import { Mail, MailOpen } from 'lucide-react'
import {motion} from 'motion/react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useState } from 'react'



export default function MailBtn(){

    const [isOpen,setIsOpen] = useState(false)

    


    return (<>
    
        <Popover onOpenChange={(n) => setIsOpen(n)}>
            <PopoverTrigger asChild>
                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    {isOpen ? <MailOpen/> : <Mail/>}
                </motion.button>
            </PopoverTrigger>


            <PopoverContent className='bg-black text-white w-96'>

                No Messages.

            </PopoverContent>
        </Popover>
    
    </>)
}