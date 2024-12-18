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

            <Cell><span>{first} {last.substring(0,1)}</span></Cell>
            <Cell><span>{avail[0].leave ? <TimeOffTag/> : `${parseTime(avail[0].from)} - ${parseTime(avail[0].to)}`}</span></Cell>   {/*Sunday*/}
            <Cell><span>{avail[1].leave ? <TimeOffTag/> : `${parseTime(avail[1].from)} - ${parseTime(avail[1].to)}`}</span></Cell>   {/*Monday*/}
            <Cell><span>{avail[2].leave ? <TimeOffTag/> : `${parseTime(avail[2].from)} - ${parseTime(avail[2].to)}`}</span></Cell>   {/*Tuesday*/}
            <Cell><span>{avail[3].leave ? <TimeOffTag/> : `${parseTime(avail[3].from)} - ${parseTime(avail[3].to)}`}</span></Cell>   {/*Wednesday*/}
            <Cell><span>{avail[4].leave ? <TimeOffTag/> : `${parseTime(avail[4].from)} - ${parseTime(avail[4].to)}`}</span></Cell>   {/*Thursday*/}
            <Cell><span>{avail[5].leave ? <TimeOffTag/> : `${parseTime(avail[5].from)} - ${parseTime(avail[5].to)}`}</span></Cell>   {/*Friday*/} 
            <Cell><span>{avail[6].leave ? <TimeOffTag/> : `${parseTime(avail[6].from)} - ${parseTime(avail[6].to)}`}</span></Cell>  {/*Saturday*/}

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