import { ComponentProps, useReducer, useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Check, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Availability {
    sunday: {from: string,to: string},
    monday: {from: string,to: string},
    tuesday: {from: string,to: string},
    wednesday: {from: string,to: string},
    thursday: {from: string,to: string},
    friday: {from: string,to: string},
    saturday: {from: string,to: string},
}

interface NameEntry {
    name: string,
    availability: Availability
}

interface Props {
    
    onNameAdded: (entry: NameEntry) => void
}

const week = ['S','M','T','W','TH','F','SA']
const times = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

type FullName = {
    S: 'sunday',
    M: 'monday',
    T: 'tuesday',
    W: 'wednesday',
    TH: 'thursday',
    F: 'friday',
    SA: 'saturday'
}

const fullName: FullName = {
    S: 'sunday',
    M: 'monday',
    T: 'tuesday',
    W: 'wednesday',
    TH: 'thursday',
    F: 'friday',
    SA: 'saturday'
}

function toFullName(d: keyof FullName){

    return fullName[d]
}

export default function NameLabelAdd({onNameAdded}: Props){

    const [name,setName] = useState('')
    const [selectedDay,setDay] = useState('')

    const [availability,setAvailability] = useReducer<Availability,any>((prev: Availability,action: {day: keyof FullName,from: string | null,to: string | null}) => {

        const {day,from,to} = action

        const newAvail: Availability = {...prev}

        console.log(prev)

        
        newAvail[toFullName(day as keyof FullName)] = {
            from: from || prev[toFullName(day as keyof FullName)].from,
            to: to || prev[toFullName(day as keyof FullName)].to
        }
        

        return newAvail
    },{
        sunday: {from: '',to: ''},
        monday: {from: '',to: ''},
        tuesday: {from: '',to: ''},
        wednesday: {from: '',to: ''},
        thursday: {from: '',to: ''},
        friday: {from: '',to: ''},
        saturday: {from: '',to: ''}
    })
    


    return <>
    
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-transparent hover:bg-slate-600 border border-dashed border-white text-white"> <Plus/> </Button>
            </PopoverTrigger>

            <PopoverContent className="bg-gradient-to-tr from-slate-800 to-slate-700 border-none  shadow-black shadow-sm">
                <Input onChange={e => setName(e.target.value)} className="text-white bg-slate-900" placeholder="Name"/>


                <Tabs onValueChange={v => setDay(v)} className="bg-gradient-to-tr from-slate-800 to-slate-700">
                    <TabsList className="bg-gradient-to-tr from-slate-800 to-slate-700">
                        {week.map( d => <TabsTrigger className="" key={d} value={d}>{d}</TabsTrigger>)}
                    </TabsList>

                    {
                        week.map(d => <TabsContent className="flex gap-2" key={`CONTENT_${d}`} value={d}>
                            <Select onValueChange={v => setAvailability({day: d,from: v,to: null})}>
                                <SelectTrigger className="bg-gradient-to-tr from-slate-800 to-slate-700 text-white border-none">
                                    <SelectValue placeholder='From'/>
                                </SelectTrigger>

                                <SelectContent className="bg-gradient-to-tr from-slate-800 to-slate-700 text-white">
                                    {times.map(t => <SelectItem key={'select_'+t} value={`${t}`}>{parseTime(`${t}`)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={v => setAvailability({day: d,from: null,to: v})}>
                                <SelectTrigger className="bg-gradient-to-tr from-slate-800 to-slate-700 text-white border-none">
                                    <SelectValue placeholder='To'/>
                                </SelectTrigger>

                                <SelectContent className="bg-gradient-to-tr from-slate-800 to-slate-700 text-white">
                                    {times.map(t => <SelectItem key={'select_'+t} value={`${t}`}>{parseTime(`${t}`)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TabsContent>)
                    }
                </Tabs>
                <Button variant={'secondary'} onClick={() => onNameAdded({ name , availability })} className="w-full mt-1 dark"> <Check/> </Button>

            </PopoverContent>
        </Popover>
    
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

    return `${timeAsInt}:00 ${isAM ? 'am' : 'pm'}`
}