'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"



interface Props {
    params: {id: string}
}

const daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
const times = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

interface Availability {
    sunday: {from: string,to: string},
    monday: {from: string,to: string},
    tuesday: {from: string,to: string},
    wednesday: {from: string,to: string},
    thursday: {from: string,to: string},
    friday: {from: string,to: string},
    saturday: {from: string,to: string},
}

export default function Availability({ params }: Props){

    const supabase = createClient()

    const [availability,setAvailability] = useState<Availability | null>(null)

    useEffect(() => {

        supabase.from('availability').select().eq('business_id',params.id)
            .then(({data,error}) => {
                if(error) console.error(error)
                else setAvailability(data[0])

                console.log(data)
            })


    },[])

    function updateOfFrom(d: string,value: string){
        setAvailability((prev) => {
            let newObj: typeof prev = Object.create(prev)
            if(newObj){
                newObj[(d as keyof Availability)].from = value
            }

            return newObj
        })
    }
    function updateOfTo(d: string,value: string){
        setAvailability((prev) => {
            if(prev){
                prev[(d as keyof Availability)].to = value
            }

            return prev
        })
    }

    useEffect(() =>{
        console.log(availability)
    },[availability])


    return <>
    
        <div>
            <Tabs  defaultValue="sunday" className="dark">
                <TabsList>
                    <TabsTrigger value="sunday">Sunday</TabsTrigger>
                    <TabsTrigger value="monday">Monday</TabsTrigger>
                    <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
                    <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
                    <TabsTrigger value="thursday">Thursday</TabsTrigger>
                    <TabsTrigger value="friday">Friday</TabsTrigger>
                    <TabsTrigger value="saturday">Saturday</TabsTrigger>
                </TabsList>

                {daysOfWeek.map(d => <TabsContent key={'tab_'+d} value={d}>
                    <div className="flex justify-center gap-2 w-full">
                        <span className="grow">Available on {d}s? </span> <Switch/>
                    </div>

                    <div className="flex gap-5">
                        <Select onValueChange={(v) => updateOfFrom(d,v)}>
                            <SelectTrigger>
                                <SelectValue  placeholder={availability ? (parseTime(availability[(d as keyof Availability)].from)) : 'From'}/>
                            </SelectTrigger>

                            <SelectContent className="bg-black text-white">
                                {times.map(t => <SelectItem key={'select_'+t} value={`${t}`}>{parseTime(`${t}`)}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger>
                                <SelectValue  placeholder={availability ? (parseTime(availability[(d as keyof Availability)].to)) : 'To'}/>
                            </SelectTrigger>

                            <SelectContent className="bg-black text-white">
                                {times.map(t => <SelectItem key={'select_'+t} value={`${t}`}>{parseTime(`${t}`)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>)}

            </Tabs>
        </div>
    
    
    </>

}



function parseTime(time: string): string {
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

    console.log(`${timeAsInt}:00 ${isAM ? 'am' : 'pm'}`)

    return `${timeAsInt}:00 ${isAM ? 'am' : 'pm'}`
}