'use server'
import { add, formatDate, sub } from "date-fns";


export default async function WeeklyScheduler(){

    let day = new Date()

    while(day.getDay() != 0){
        day = sub(day,{ days: 1 })
    }

    let nextDays = []

    while(day.getDay() <= 6){
        nextDays[day.getDay()] = day

        day = add(day,{days: 1})
    }



    return <>
    
    <main className="flex justify-center">

        <div className="bg-white p-4 text-black w-[65%] max-w-[800px] print:w-[850px] print:h-[952px] aspect-[17/22] flex justify-center">

            <div className="grid grid-rows-10 grid-cols-7">

                {/* Days of the Week */}
                <span className="font-medium text-center">Sunday <br/> {formatDate(nextDays[0],"M/dd")}</span>
                <span className="font-medium text-center">Monday <br/> {formatDate(nextDays[0],"M/dd")}</span>
                <span className="font-medium text-center">Tuesday <br/> {formatDate(nextDays[0],"M/dd")} </span>
                <span className="font-medium text-center px-2">Wednesday <br/> {formatDate(nextDays[0],"M/dd")} </span>
                <span className="font-medium text-center">Thursday <br/> {formatDate(nextDays[0],"M/dd")} </span>
                <span className="font-medium text-center">Friday <br/> {formatDate(nextDays[0],"M/dd")} </span>
                <span className="font-medium text-center">Saturday <br/> {formatDate(nextDays[0],"M/dd")} </span>
                
            </div>
       

        </div>

    </main>
    
    </>
}