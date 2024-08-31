'use client'
import { add, formatDate, sub } from "date-fns"
import { useEffect, useRef } from "react";

import { createSwapy } from 'swapy'


export default function WeeklyScheduler(){

    let startDate = new Date()

    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const swapy = createSwapy(container.current)

        swapy.enable(true)
    })

    // while(startDate.getDay() != 0){
    //     startDate = sub(startDate,{ days: 1 })
    // }

    //! SWAPY NOT WORKING i hate my life


    return <>
    
    <main className="flex justify-center">

        <div className="bg-white p-4 text-black w-[65%] max-w-[800px] print:w-[850px] print:h-[952px] aspect-[17/22] flex justify-center">

            <div id="test" ref={container} className="grid grid-rows-40 grid-cols-8">

                {/* Days of the Week */}
                <span className="font-medium text-center col-start-2"> Sunday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="font-medium text-center"> Monday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="font-medium text-center"> Tuesday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="font-medium text-center"> Wednesday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="font-medium text-center"> Thursday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="font-medium text-center"> Friday <br/> {formatDate(new Date(),"M/dd")}</span>
                <span className="font-medium text-center"> Saturday <br/> {formatDate(new Date(),"M/dd")}</span>
                
                <div date-swapy-slot="a" className="border">
                
                </div>
                <div date-swapy-slot="b" className="border">
                    <div data-swapy-item="123">test2</div>
                </div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                <div className="border"></div>
                
            </div>
       

        </div>

    </main>
    
    </>
}