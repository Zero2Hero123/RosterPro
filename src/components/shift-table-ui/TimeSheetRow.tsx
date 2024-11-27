'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import Cell from "./Cell"

type Props  = {
    personName: string,
    avail: ({leave: false, from: string, to: string} | {leave: true, from: null, to: null})[]
    
    asPlaceHolder: false
} | {
    personName: '',
    avail: []

    asPlaceHolder: true
}

export default function TimeSheetRow({personName,avail,asPlaceHolder = false}: Props){
    
    if(asPlaceHolder){
        return <>
    
        <Cell>{}</Cell>
        <Cell></Cell>  {/*Sunday*/}
        <Cell></Cell>  {/*Monday*/}
        <Cell></Cell>  {/*Tuesday*/}
        <Cell></Cell>  {/*Wednesday*/}
        <Cell></Cell>  {/*Thursday*/}
        <Cell></Cell>  {/*Friday*/} 
        <Cell></Cell>  {/*Saturday*/}
    
    </>
    }

    const [first,last] = personName.split(' ')
    return <>

        <TooltipProvider>

            <Cell>{first} {last.substring(0,1)}</Cell>
            <Cell>{avail[0].leave ? <TimeOffTag/> : `${parseTime(avail[0].from)} - ${parseTime(avail[0].to)}`}</Cell>   {/*Sunday*/}
            <Cell>{avail[1].leave ? <TimeOffTag/> : `${parseTime(avail[1].from)} - ${parseTime(avail[1].to)}`}</Cell>   {/*Monday*/}
            <Cell>{avail[2].leave ? <TimeOffTag/> : `${parseTime(avail[2].from)} - ${parseTime(avail[2].to)}`}</Cell>   {/*Tuesday*/}
            <Cell>{avail[3].leave ? <TimeOffTag/> : `${parseTime(avail[3].from)} - ${parseTime(avail[3].to)}`}</Cell>   {/*Wednesday*/}
            <Cell>{avail[4].leave ? <TimeOffTag/> : `${parseTime(avail[4].from)} - ${parseTime(avail[4].to)}`}</Cell>   {/*Thursday*/}
            <Cell>{avail[5].leave ? <TimeOffTag/> : `${parseTime(avail[5].from)} - ${parseTime(avail[5].to)}`}</Cell>   {/*Friday*/} 
            <Cell>{avail[6].leave ? <TimeOffTag/> : `${parseTime(avail[6].from)} - ${parseTime(avail[6].to)}`}</Cell>  {/*Saturday*/}

        </TooltipProvider>
    </>
}

function parseTime(time: string,minutes: string = '00'): string {
    if(!time) return ''
    let timeAsInt = Number(time)

    let isAM = true;

    if(timeAsInt == 24){
        return '11:59 pm'
    }

    if(timeAsInt >= 12){
        timeAsInt -= 12
        isAM = false
    }

    if(timeAsInt == 0){
        timeAsInt = 12;
    }

    // console.log(`${timeAsInt}:00 ${isAM ? 'am' : 'pm'}`)

    return `${timeAsInt}${minutes == '00' ? '' : `${minutes}`}${isAM ? 'am' : 'pm'}`
}

function TimeOffTag(){
    
    return <Tooltip>
        <TooltipTrigger asChild>
            <span className="font-semibold hover:cursor-help">T</span>
        </TooltipTrigger>

        <TooltipContent>
            <span>Time Off</span>
        </TooltipContent>
    </Tooltip>
}