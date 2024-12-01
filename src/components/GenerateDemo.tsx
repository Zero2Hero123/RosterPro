'use client'

import { Loader2Icon, TriangleIcon } from 'lucide-react'
import {motion} from 'motion/react'
import { useEffect, useState, useTransition } from 'react'





export default function GenerateDemo(){

    const [isLoading,setIsLoading] = useState<boolean>(false)

    async function demoGenerate(){

        setIsLoading(true)

        await setTimeout(() => {
            setIsLoading(false)  
        },1500)

    }

    const lengths = ['24','36','48','64','full']

    function trigger(){
        if(isLoading) return

        setIsLoading(true)

        setTimeout(() => {

            setIsLoading(false)

        },1000)

    }

    useEffect(() => {
        trigger()
    },[])

    return <>
    
        <div className='flex flex-col lg:flex-row items-center gap-24'>
        <motion.div animate={{rotateX: 0, rotateY: -10, rotateZ: -5}} className='flex border border-gray-700 bg-gray-950 rounded-md h-44 w-72 flex-col p-1'>

            <span className='text-center'>Availabilty</span>
            <div className='flex flex-col grow gap-3 p-1'>
                <motion.div className='grow w-24 bg-gradient-to-tr from-slate-400 to-slate-300 rounded-am rounded-sm'></motion.div>
                <motion.div className='grow w-44  bg-gradient-to-tr from-slate-400 to-slate-300 rounded-am rounded-sm'></motion.div>
                <motion.div className='grow w-36 bg-gradient-to-tr from-slate-400 to-slate-300 rounded-am rounded-sm'></motion.div>
                <motion.div className='grow  bg-gradient-to-tr from-slate-400 to-slate-300 rounded-am rounded-sm'></motion.div>
            </div>
            
            <div className='flex justify-center'>
                <motion.button disabled={isLoading} onClick={trigger} whileHover={{scale: 1.05}} whileTap={{scale: 0.8}} className='p-2 bg-gradient-to-tr text-black from-white to-slate-200 rounded-md'>Generate Schedule</motion.button>
            </div>
        </motion.div>


        <motion.div animate={{rotateY: 0, rotateZ: 3}} className='flex p-2 gap-2 flex-col bg-white w-[15vw] min-w-[275px]  h-[50vh] min-h-[400px]'>
            <span className='text-black text-center'>Schedule</span>
            {isLoading ? <div className='w-full grow flex justify-center items-center'> <Loader2Icon className='animate-spin' color='gray' size={'100'}/> </div> : <>
            
                <motion.div className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr from-slate-400 to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            <motion.div initial={{opacity: 0, translateY: -10}} animate={{opacity: 1, translateY: 0}} className={`grow w-${lengths[Math.floor(Math.random() * lengths.length)]} bg-gradient-to-tr ${Math.random() > 0.5 ? 'from-slate-400' : 'from-slate-600'} to-slate-300 rounded-am rounded-sm`}></motion.div>
            
            </>}
        </motion.div>
        </div>

    
    </>
}