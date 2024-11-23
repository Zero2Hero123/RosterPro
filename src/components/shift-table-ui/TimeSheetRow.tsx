'use client'

import Cell from "./Cell"

interface Props {
    personName: string,
    avail: {from: string, to: string}[]
}

export default function TimeSheetRow({personName,avail}: Props){


    return <>
    
        <Cell>{personName}</Cell>
        <Cell>{parseTime(avail[0].from)} - {parseTime(avail[0].to)}</Cell>  {/*Sunday*/}
        <Cell>{parseTime(avail[1].from)} - {parseTime(avail[1].to)}</Cell>  {/*Monday*/}
        <Cell>{parseTime(avail[2].from)} - {parseTime(avail[2].to)}</Cell>  {/*Tuesday*/}
        <Cell>{parseTime(avail[3].from)} - {parseTime(avail[3].to)}</Cell>  {/*Wednesday*/}
        <Cell>{parseTime(avail[4].from)} - {parseTime(avail[4].to)}</Cell>  {/*Thursday*/}
        <Cell>{parseTime(avail[5].from)} - {parseTime(avail[5].to)}</Cell>  {/*Friday*/} 
        <Cell>{parseTime(avail[6].from)} - {parseTime(avail[6].to)}</Cell>  {/*Saturday*/}
    
    </>
}

function parseTime(time: string): string {
    if(!time) return '--:--'
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

    return `${timeAsInt}:00${isAM ? 'a' : 'p'}`
}