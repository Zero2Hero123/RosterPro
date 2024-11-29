'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, useToast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/auth-js"
import { useCallback, useEffect, useReducer, useState, use, ReducerState } from "react";



interface Props {
    params: Promise<{id: string}>
}

const daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
const times = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

interface Availability {
    sunday: {from: string,to: string, enabled: boolean},
    monday: {from: string,to: string, enabled: boolean},
    tuesday: {from: string,to: string, enabled: boolean},
    wednesday: {from: string,to: string, enabled: boolean},
    thursday: {from: string,to: string, enabled: boolean},
    friday: {from: string,to: string, enabled: boolean},
    saturday: {from: string,to: string, enabled: boolean},
}

type DaysEnabled = {
    [key in keyof Availability]: boolean
}
type AvailabilityAction = {direction: 'from' | 'to', day: string, newTime: string} | {direction: 'SET',days?: null,action: Availability} | {direction: 'SET-DAY', day: string,action: boolean}
type AvailabilityReducer = (prev: Availability,action: AvailabilityAction) => Availability

function updateAvailabilty(prevState: Availability,action: AvailabilityAction){
    prevState = {
        ...prevState
    }

    if(action.direction == 'SET'){
        return action.action
    } else if(action.direction == 'SET-DAY'){
        prevState[(action.day as keyof Availability)].enabled = action.action

        return prevState
    }

    prevState[(action.day as keyof Availability)][action.direction] = action.newTime

    return prevState
}

export default function Availability(props: Props) {
    const params = use(props.params);

    const supabase = createClient()

    const { toast } = useToast()

    const [showSave,setShowSave] = useState<boolean>(false)

    const [availability,setAvailability] = useReducer<Availability,any>(updateAvailabilty,{
        sunday: {from: '',to: '', enabled: false},
        monday: {from: '',to: '', enabled: false},
        tuesday: {from: '',to: '', enabled: false},
        wednesday: {from: '',to: '', enabled: false},
        thursday: {from: '',to: '', enabled: false},
        friday: {from: '',to: '', enabled: false},
        saturday: {from: '',to: '', enabled: false},
    })

    const [user,setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getUser()
            .then(res => setUser(res.data.user))
    },[])

    useEffect(() => {

        if(user){
            supabase.from('availability').select().eq('business_id',params.id).eq('user_id',user.id)
            .then(({data,error}) => {
                if(error) {
                    console.error(error.message)
                } else if(data.length) {


                    setAvailability({
                        direction: 'SET',
                        action: data[0]
                    })
                }

                // console.log(data)
            })
        }

    },[user])

    useEffect(() => {
        console.log(availability)
    },[availability])

    const saveAvailability = (day: string) => {
        console.log(availability[(day as keyof Availability)])
        supabase.from('availability').update({
            [day]: {
                from: availability[(day as keyof Availability)].from,
                to: availability[(day as keyof Availability)].to,
                enabled: availability[(day as keyof Availability)].enabled
            },
        }).eq('user_id',user?.id).eq('business_id',params.id).then(res => {
            if(res.error) {
                console.error(res.error)
            } else {
                console.log(res.status)
                toast({
                    title: 'Successfully Saved Changes!'
                })
            }

            setShowSave(false)
            
        })
        
    }

    function sendUpdate(data: AvailabilityAction){
        setAvailability(data)
        
    }

    useEffect(() =>{
        setShowSave(true)
    },[availability])


    return <>
    
        <div>
            <Tabs defaultValue="sunday" className="dark">
                <TabsList>
                    <TabsTrigger value="sunday">Sunday</TabsTrigger>
                    <TabsTrigger value="monday">Monday</TabsTrigger>
                    <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
                    <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
                    <TabsTrigger value="thursday">Thursday</TabsTrigger>
                    <TabsTrigger value="friday">Friday</TabsTrigger>
                    <TabsTrigger value="saturday">Saturday</TabsTrigger>
                </TabsList>

                {daysOfWeek.map((d,i) => < TabsContent className="flex flex-col gap-3" key={'tab_'+d+i} value={d}>
                    <div className="flex gap-2 w-full mt-2">
                        <span className="grow">Available on {d}s? </span> <Switch checked={availability[(d as keyof Availability)].enabled} onCheckedChange={ (e) => setAvailability({direction: 'SET-DAY',day: d,action: e.valueOf()})} />
                    </div>

                    <div className="flex gap-5 mt-1">
                        <Select onValueChange={(v) => sendUpdate({direction: 'from',day: d, newTime: v})} disabled={!availability[(d as keyof Availability)].enabled} >
                            <SelectTrigger>
                                <SelectValue  placeholder={availability ? (parseTime(availability[(d as keyof Availability)].from)) : 'From'}/>
                            </SelectTrigger>

                            <SelectContent className="bg-black text-white">
                                {times.map(t => <SelectItem key={'select_'+t} value={`${t}`}>{parseTime(`${t}`)}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(v) => sendUpdate({direction: 'to',day: d, newTime: v})} disabled={!availability[(d as keyof Availability)].enabled} >
                            <SelectTrigger>
                                <SelectValue  placeholder={availability ? (parseTime(availability[(d as keyof Availability)].to)) : 'To'}/>
                            </SelectTrigger>

                            <SelectContent className="bg-black text-white">
                                {times.map(t => <SelectItem key={'select_'+t} value={`${t}`}>{parseTime(`${t}`)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => saveAvailability(d)} className={`transition-all ${showSave ? 'scale-100 ' : 'scale-0'}`}>Save</Button>
                    </div>
                    
                </TabsContent>)}

            </Tabs>
        </div>
    
    
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