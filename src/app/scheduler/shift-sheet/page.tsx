'use client'
import BusinessLink from "@/components/dashboard-ui/BusinessLink";
import Cell from "@/components/shift-table-ui/Cell";
import NameLabel from "@/components/shift-table-ui/NameLabel";
import NameLabelAdd, { NameEntry } from "@/components/shift-table-ui/NameLabelAdd";
import TimeSheetRow from "@/components/shift-table-ui/TimeSheetRow";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { addTemp, generateShifts, getThisSunday } from "@/utils/actions";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { add, addDays, formatDate, sub } from "date-fns"
import { Building2Icon, ChevronLeft, ChevronRight, ChevronsUpDown, Loader2Icon, Printer, SquareSlash } from "lucide-react";
import { Span } from "next/dist/trace";
import { MouseEvent, useActionState, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from 'motion/react'

import { createSwapy } from 'swapy'

export const dynamic = 'force-dynamic';


const loadingStates = ['Just a sec','Almost..','Loading..☕️','Cooking..️‍🔥']


export default function WeeklyScheduler(){

    let startDate = new Date()

    const container = useRef<HTMLDivElement>(null)
    // useEffect(() => {
    //     const swapy = createSwapy(container.current,{
    //         animation: 'dynamic'
    //     })

    //     swapy.enable(true)
    // })



    const supabase = createClient()

    const [user,setUser] = useState<User | null>(null)

    const [listOfBusinesses,setListBusinesses] = useState<any[] | null>([])
    const [selectedBusinessId, setSelectedId] = useState<any | null>(null)

    const [organizationMembers,setMembers]= useState<any[]>([])
    const [trueMembers,setTrueMembers] = useState<Set<any>>(new Set()) // organization members who should be included in the timesheet
    const rosterChatInput = useRef<HTMLInputElement>(null)

    const [data,generateShiftAction,isPending] = useActionState(generateShifts,{generated: false, schedule: null})

    const [currSchedule,setSchedule] = useState(data.schedule)

    const arr = new Array(40)
    arr.fill(1)

    const [week,setWeek] = useState<Date[]>([])

    useEffect(() => {

        supabase.auth.getUser()
            .then(res => setUser(res.data.user))

    },[])

    useEffect(() => {
        setSchedule(data.schedule)
    },[isPending])

    useEffect(() => {
        const days: Date[] = []

        getThisSunday()
            .then((sunday) => {
                let day = sunday
                for(let i = 0; i < 7; i++){
                    days.push(day)

                    day = addDays(day,1)
                }

                setWeek(days)
            })

        console.info(days)

        
    },[])

    function initChat(e: KeyboardEvent){
        if(e.key == '/'){
            rosterChatInput.current!.value = ''
            rosterChatInput.current?.focus()
        }
    }
    useEffect(() => {


        if(rosterChatInput.current){
            window.addEventListener('keypress',initChat)
        }

        return () => {
            window.removeEventListener('keypress',initChat)
        }
    },[])

    useEffect(() => {
        
        if(!user) return
        supabase.from('user_businesses').select().eq('user_id',user?.id)
        .then(({data,error}) => {
          if(error) console.warn(error)
    
          setListBusinesses(data)
        })
        
    },[user])

    useEffect(() => {
        if(!selectedBusinessId) return

        supabase.rpc('getbusinessmembers', {
            businessqueryid: selectedBusinessId
        }).then((res) => {
            if(res.error) console.error(res.error.message)

            setMembers(res.data)
            setTrueMembers(res.data.map((m: any) => `${m.first_name} ${m.last_name}`))

            
        })

    },[selectedBusinessId])

    useEffect(() => {
        console.log(trueMembers)
    },[trueMembers])


    function shiftRight(event: MouseEvent<HTMLButtonElement>) {
        
        setWeek((prev) => {

            let newWeek = [...prev]

            newWeek = newWeek.map(d => addDays(d,1))

            return newWeek
        })

    }

    function shiftLeft(event: MouseEvent<HTMLButtonElement>): void {
        setWeek((prev) => {

            let newWeek = [...prev]

            newWeek = newWeek.map(d => addDays(d,-1))

            return newWeek
        })
    }

    return <>
    
    <main className="flex justify-center gap-10 flex-col md:flex-row">

        <div className="print:hidden w-[400px] h-[500px] bg-gradient-to-tr from-slate-800 to-slate-700 shadow-lg rounded-md ml-10 my-5">


            <form action={generateShiftAction} className="flex flex-col gap-2 p-4">
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger disabled={isPending} asChild>
                            <Button className="hidden grow md:flex justify-around items-center border border-gray-500 bg-slate-700 hover:bg-slate-800"> <span className="grow text-center">{selectedBusinessId ? <BusinessLink businessId={selectedBusinessId} asLink={false} /> : 'Select an Organization'}</span> <ChevronsUpDown size={'18'}/> </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-black text-white w-56">

                        {
                            listOfBusinesses && listOfBusinesses.map(b => <DropdownMenuItem onClick={() => setSelectedId(b.business_id)} key={'LIST_'+b.business_id} className="p-0"> <BusinessLink asLink={false} businessId={b.business_id}></BusinessLink> </DropdownMenuItem>)
                        }


                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {
                    !selectedBusinessId && <div className="flex justify-center">
                        <span>No Organization Selected</span>
                    </div>
                }
                {selectedBusinessId && <span className="text-center">Employees</span>}
                <div className="flex gap-3 grow flex-wrap">

                    {organizationMembers.map(m => <NameLabel businessId={selectedBusinessId} userId={m.id} key={`Label ${m.id}`} name={`${m.first_name} ${m.last_name}`} onToggle={(enabled) => enabled ? setTrueMembers(prev => new Set(prev).add(`${m.first_name} ${m.last_name}`)) : setTrueMembers(prev => {prev.delete(`${m.first_name} ${m.last_name}`); return new Set(prev)})} />)}
                    
                    {/* {selectedBusinessId && <NameLabelAdd onNameAdded={(n) => addTemp(n,selectedBusinessId)}/>} */}
                </div>
                <div className="flex justify-center py-2 gap-2">
                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: .9}} disabled={isPending || !selectedBusinessId} type="submit" className={`bg-slate-900 flex justify-between items-center hover:cursor-pointer rounded-md p-1 disabled:opacity-50 ${isPending && 'w-36'}`}>{isPending ? <div className="flex justify-between grow overflow-hidden"><Loader2Icon className="animate-spin"/> <LoadingState/> </div> : 'Generate'}</motion.button>
                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: .9}} onClick={() => window.print()} className="bg-slate-900 disabled:opacity-50 hover:cursor-pointer rounded-md p-1 flex justify-center items-center" type='button' disabled={isPending || !data.generated}> <Printer/> </motion.button>
                </div>
                <Input readOnly name={`names`} value={[...trueMembers].join(',')} className="hidden" />
                <Input readOnly name={`businessId`} value={selectedBusinessId ?? ''} className="hidden" />
                <Input readOnly type='string' name={`startDate`} value={week.length > 0 ? week[0].toISOString() : ''} className="hidden" />
            </form>
{/* 
            <form className="flex flex-col gap-2 p-4">

                <Input ref={rosterChatInput} type="text" className="bg-slate-900 border-none hover:border-none" placeholder="Press / to start speaking to Roster"/>
                
            </form> */}

        </div>


        {/* Document Component */}
        <div className="bg-white p-4 relative text-black w-[65%] max-w-[800px] print:w-[850px] print:h-[952px] aspect-[17/22] flex justify-center mr-10">

            <Button disabled={isPending} onClick={shiftLeft} className="print:hidden absolute left-2 bg-transparent hover:bg-slate-200 bg-none" size={'icon'}> <ChevronLeft color="black"/> </Button>
            <Button disabled={isPending} onClick={shiftRight} className="print:hidden absolute right-2 bg-transparent hover:bg-slate-200 bg-none" size={'icon'}> <ChevronRight color="black"/> </Button>
            
            
            <div ref={container} className={`grid grid-rows-40 grid-cols-8`}>

                {/* Days of the Week */}
                {
                    week.map((d,i) => <span key={`WEEK_DAY_${d}`} className={`text-sm font-medium text-center ${i == 0 && 'col-start-2'}`}> {formatDate(d,'iiii')} <br/> {formatDate(d,'MM/dd')}</span>)
                }


                
                {
                    data.generated ? [...trueMembers].map((v,i) => {arr.pop(); return <TimeSheetRow key={`ROW_${i}`} asPlaceHolder={false} personName={v} avail={data.generated ? data.schedule[v] : []}/>}) : arr.map((v,i) => <TimeSheetRow asPlaceHolder={true} key={'row' + i} personName={""} avail={[]} />)
                }

                {
                    data.generated && arr.map((v,i) => <TimeSheetRow asPlaceHolder={true} key={'row' + i} personName={""} avail={[]} />)
                }
                
            </div>
       

        </div>

    </main>
    
    </>
}

function LoadingState(){

    const [curr,setCurr] = useState(0);

    const increment = () => {
        setCurr(prev => prev == loadingStates.length-1 ? 0 : prev+1)
    }

    useEffect(() => {

        const loop = setInterval(increment,3000)

        return () => {
            clearInterval(loop)
        }
    },[])

    return <motion.div transition={{repeat: Infinity, times: [0,.1,1,1.8],repeatDelay:1, duration:2}} animate={{translateY: [100,0,0,-100], scale: [0,1,1,0]}} className="flex grow justify-center">{loadingStates[curr]}</motion.div>

}