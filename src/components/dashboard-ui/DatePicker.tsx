'use client'

import { addDays, format } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"



const DatePicker = () => {
    const [dateRange,setRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(),7)
    })



    return <>
    
        <Calendar className="dark bg-black text-white" mode="range" selected={dateRange} onSelect={setRange}/>
        {(dateRange && dateRange.to && dateRange.from) && <span>{format(dateRange.from || '','MMMM dd,yyyy')} to {format(dateRange.to || '','MMMM dd,yyyy')}</span>}
        
        {dateRange && <Input className="bg-black hidden" readOnly name="from" value={dateRange.from?.valueOf()}/>}
        {dateRange && <Input className="bg-black hidden" readOnly name="to" value={dateRange.to?.valueOf()}/>}
    </>
}

export default DatePicker;