'use client'

import Cell from "./Cell"

type Props  = {
    personName: string,
    avail: {from: string, to: string}[]
    
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
    
        <Cell>{first} {last.substring(0,1)}</Cell>
        <Cell>{parseTime(avail[0].from)} - {parseTime(avail[0].to)}</Cell>  {/*Sunday*/}
        <Cell>{parseTime(avail[1].from)} - {parseTime(avail[1].to)}</Cell>  {/*Monday*/}
        <Cell>{parseTime(avail[2].from)} - {parseTime(avail[2].to)}</Cell>  {/*Tuesday*/}
        <Cell>{parseTime(avail[3].from)} - {parseTime(avail[3].to)}</Cell>  {/*Wednesday*/}
        <Cell>{parseTime(avail[4].from)} - {parseTime(avail[4].to)}</Cell>  {/*Thursday*/}
        <Cell>{parseTime(avail[5].from)} - {parseTime(avail[5].to)}</Cell>  {/*Friday*/} 
        <Cell>{parseTime(avail[6].from)} - {parseTime(avail[6].to)}</Cell>  {/*Saturday*/}
    
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