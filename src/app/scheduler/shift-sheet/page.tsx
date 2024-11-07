'use client'
import Cell from "@/components/shift-table-ui/Cell";
import NameLabel from "@/components/shift-table-ui/NameLabel";
import NameLabelAdd from "@/components/shift-table-ui/NameLabelAdd";
import { add, formatDate, sub } from "date-fns"
import { Span } from "next/dist/trace";
import { useEffect, useRef } from "react";

import { createSwapy } from 'swapy'


export default function WeeklyScheduler(){

    let startDate = new Date()

    const container = useRef<HTMLDivElement>(null)

    let arr = new Array(312)
    arr.fill(1)

    useEffect(() => {
        const swapy = createSwapy(container.current,{
            animation: 'dynamic'
        })

        swapy.enable(true)
    })

    // while(startDate.getDay() != 0){
    //     startDate = sub(startDate,{ days: 1 })
    // }


    return <>
    
    <main className="flex justify-center gap-10 flex-col md:flex-row">

        <div className="print:hidden w-[400px] h-[500px] bg-gradient-to-tr from-slate-800 to-slate-700 shadow-lg rounded-md ml-10 my-5">


            <div className="flex p-4 gap-3">
                <NameLabel name="Hero Emenalom" onToggle={() => console.log} />
                <NameLabelAdd/>
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