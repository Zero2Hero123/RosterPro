'use client'
import BusinessLink from "@/components/dashboard-ui/BusinessLink";
import Cell from "@/components/shift-table-ui/Cell";
import NameLabel from "@/components/shift-table-ui/NameLabel";
import NameLabelAdd from "@/components/shift-table-ui/NameLabelAdd";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { add, formatDate, sub } from "date-fns"
import { ChevronsUpDown } from "lucide-react";
import { Span } from "next/dist/trace";
import { useEffect, useRef, useState } from "react";

import { createSwapy } from 'swapy'


export default function WeeklyScheduler(){

    let startDate = new Date()

    let arr = new Array(312)
    arr.fill(1)

    const container = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const swapy = createSwapy(container.current,{
            animation: 'dynamic'
        })

        swapy.enable(true)
    })



    const supabase = createClient()

    const [user,setUser] = useState<User | null>(null)

    const [listOfBusinesses,setListBusinesses] = useState<any[] | null>([])
    const [selectedBusinessId, setSelectedId] = useState<any | null>(null)

    const [organizationMembers,setMembers]= useState<any[]>([])




    useEffect(() => {

        supabase.auth.getUser()
            .then(res => setUser(res.data.user))

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
            
        })

    },[selectedBusinessId])


    return <>
    
    <main className="flex justify-center gap-10 flex-col md:flex-row">

        <div className="print:hidden w-[400px] h-[500px] bg-gradient-to-tr from-slate-800 to-slate-700 shadow-lg rounded-md ml-10 my-5">


            <div className="flex flex-col gap-2 p-4">
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="hidden grow md:flex justify-around items-center border border-gray-500 bg-slate-700 hover:bg-slate-800"> <span className="grow text-center">{selectedBusinessId ? <BusinessLink businessId={selectedBusinessId} asLink={false} /> : 'Select an Organization'}</span> <ChevronsUpDown size={'18'}/> </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-black text-white w-56">

                        {
                            listOfBusinesses && listOfBusinesses.map(b => <DropdownMenuItem onClick={() => setSelectedId(b.business_id)} key={'LIST_'+b.business_id} className="p-0"> <BusinessLink asLink={false} businessId={b.business_id}></BusinessLink> </DropdownMenuItem>)
                        }


                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-3 flex-wrap">

                    {organizationMembers.map(m => <NameLabel key={`Label ${m.id}`} name={`${m.first_name} ${m.last_name}`} onToggle={() => console.log} />)}

                    <NameLabelAdd/>
                </div>
            </div>

        </div>


        {/* Document Component */}
        <div className="bg-white p-4 text-black w-[65%] max-w-[800px] print:w-[850px] print:h-[952px] aspect-[17/22] flex justify-center mr-10">

            <div ref={container} className="grid grid-rows-40 grid-cols-8">

                {/* Days of the Week */}
                <span className="text-sm font-medium text-center col-start-2"> Sunday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="text-sm font-medium text-center"> Monday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="text-sm font-medium text-center"> Tuesday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="text-sm font-medium text-center"> Wednesday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="text-sm font-medium text-center"> Thursday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="text-sm font-medium text-center"> Friday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="text-sm font-medium text-center"> Saturday <br/> {formatDate(new Date(),"M/dd")}</span>
                
                {
                    arr.map((v,i) => <Cell key={'cell_'+i} index={i} />)
                }
                
            </div>
       

        </div>

    </main>
    
    </>
}