'use client'

import Document from "@/components/Document";
import JobParameter from "@/components/JobParameter";
import ParamController from "@/components/ParamController";
import Segment from "@/components/Segment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import generate from "@/utils/actions";
import { addDays, format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

type Jobs = Record<string,number>

export type PercentagesMap = Record<string,Jobs>

export type Action = {
    prop: string,
    propType: 'name' | 'job',
    type: 'add' | 'remove'
    names: string[],
    jobs: string[]
}

export type SetAction = Omit<Action,'names' | 'jobs' | 'type'> & {
    percentValue: number,
    forName: string
    type: 'set-job'
}

type JobPercentagesReducer = (percentages: PercentagesMap,action: Action | SetAction) => PercentagesMap

const reducer: JobPercentagesReducer = (percentages,action) => {

    // console.info('ACTION ',action)

    const jobMap: Jobs = {}
    if(action.type != 'set-job'){
        for(let job of action.jobs){
            jobMap[job] = 100
        }
    }

    if(action.type == 'set-job'){
        const newMap = new Object(percentages) as PercentagesMap

        newMap[action.forName][action.prop] = action.percentValue;

        return newMap;
    }

    if(action.propType == 'name' && action.prop.length > 0){
        if(action.type == 'add'){
            
            return {
                ...percentages,
                [action.prop]: new Object(jobMap) as Jobs
            }    
        } else if(action.type == 'remove'){
            let newMap = new Object(percentages) as PercentagesMap
            
            delete newMap[action.prop]

            return newMap;
        }

    } else if(action.propType == 'job' && action.prop.length > 0){
        
        if(action.type == 'add'){
            console.log('add HERE')
            const newMap = new Object(percentages) as PercentagesMap
            for(let name of action.names){
                newMap[name] = {
                    ...jobMap, [action.prop]: 100
                }
            }
            return newMap;
        
        } else if(action.type == 'remove'){
            const newMap = new Object(percentages) as PercentagesMap
            for(let name of action.names){
                delete newMap[name][action.prop]
            }
            return newMap;
        }
    }

    return percentages;
}


type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
type DaysMap = Record<Day,boolean>
type ToggleAction = { day: Day, newVal: boolean }
export default function Scheduler(){

    const nameInputRef = useRef<HTMLInputElement>(null)
    const addNameBtnRef = useRef<HTMLButtonElement>(null)

    const jobInputRef = useRef<HTMLInputElement>(null)
    const addJobBtn = useRef<HTMLButtonElement>(null)

    const [names,setNames] = useState<string[]>([])
    const [jobs,setJobs] = useState<string[]>([])

    const [enteredName,setEnteredName] = useState<string>('')
    const [enteredJob,setEnteredJob] = useState<string>('')

    const [selectedPerson,setSelectedPerson] = useState('')


    // DATES
    const [selectedRange,setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(),30)
    })

    const [selectedDays,setDays] = useState<DaysMap>({
        sunday: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true
    })

    
    const chosenDays = useMemo(() => { // ! This doesnt work for some reason

        let list = new Array()
        
        for(let d in selectedDays){
            if(selectedDays[d as Day] === true){
                list.push(d)
            }
        }
        
        return list
    },[selectedDays])

    useEffect(() => {
        console.log(chosenDays)
    },[chosenDays])

    function updateDay(dayInfo: {day: Day, newVal: boolean}){
        console.log(dayInfo)
        setDays(prev => {
            let dayMap = new Object(prev) as DaysMap

            dayMap[dayInfo.day] = dayInfo.newVal

            return dayMap
        })

        forceUpdate()
    }

    const [advancedEnabled,setAdvancedEnabled] = useState<boolean>(false)

    const [,forceUpdate] = useReducer(prev => prev+1,0)


    const [percentages,dispatch] = useReducer(reducer,{})

    useEffect(() => {
        
        console.log(selectedDays)
    ,[selectedDays]})
    
    function removeName(name: string){

        const newNames = names.copyWithin(0,0)

        const idx = newNames.indexOf(name)

        newNames.splice(idx,1)

        setNames(newNames)
        dispatch({prop: name, propType: 'name',type: 'remove',names: names,jobs: jobs})
        forceUpdate()

    }
    function removeJob(job: string){

        const newJobs = jobs.copyWithin(0,0)

        const idx = newJobs.indexOf(job)

        newJobs.splice(idx,1)
    
        setJobs(newJobs)
        dispatch({prop: job, propType: 'job',type: 'remove',names: names,jobs: jobs})
        forceUpdate()

    }

    function updatePercentages(props: {percent: number,forName: string,job: string}){
        forceUpdate()
        dispatch({prop: props.job, propType: 'job',type: 'set-job',percentValue: props.percent,forName: props.forName})
    }



    return (<>
    
        <main>
            <span className="flex justify-center text-3xl font-medium print:hidden">Person-Job Scheduler</span>
            
            <header className="flex justify-center gap-2 flex-wrap print:hidden">
                <ParamController title="People">
                    <div className="flex gap-2 px-2">
                        <Input onKeyDown={e => e.key == 'Enter' && addNameBtnRef.current?.click()} ref={nameInputRef} className="bg-black" onChange={e => setEnteredName(e.target.value)} placeholder="Name" />
                        <Button ref={addNameBtnRef} className="bg-white text-black" onClick={() => {
                            dispatch({prop: enteredName, propType: 'name',type: 'add',names: names,jobs: jobs})

                            setNames(prev => {
                            if(nameInputRef.current) nameInputRef.current.value = ''
                            return [...prev,enteredName]
                        });}}> <Plus/> </Button>
                    </div>
                
                    
                    <ScrollArea className="h-[80%] max-h-[79%]">
                        <div className="flex flex-col pt-6 px-4 gap-2">
                            {names.map(name => <Segment key={name} onClick={() => removeName(name)} title={name}/>)}
                        </div>
                    </ScrollArea>

                </ParamController>

                <ParamController title="Jobs">
                    <div className="flex gap-2 px-2">
                        <Input onKeyDown={e => e.key == 'Enter' && addJobBtn.current?.click()} ref={jobInputRef} className="bg-black" onChange={e => setEnteredJob(e.target.value)} placeholder="Job or Task" />
                        <Button ref={addJobBtn} className="bg-white text-black" onClick={() => {
                            dispatch({prop: enteredJob, propType: 'job',type: 'add',names: names,jobs: jobs});
                            setJobs(prev => {
                            
                            if(jobInputRef.current)jobInputRef.current.value = ''
                            return [...prev,enteredJob]
                        });}}> <Plus/> </Button>
                    </div>

            
                
                    <ScrollArea className="h-[80%] max-h-[79%]">
                        <div className="flex flex-col pt-6 px-4 gap-2 ">
                            {jobs.map(job => <Segment key={job} onClick={() => removeJob(job)} title={job}/>)}
                        </div>
                    </ScrollArea>
                    
            
                </ParamController>

                <ParamController title="Range">
                <div className="flex flex-col items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="bg-black text-white flex gap-3 w-[200px]">
                                <CalendarIcon size={20} />
                                {
                                    (selectedRange?.to && selectedRange?.from) ? 
                                    <>
                                        {format(selectedRange.from,'LLL dd')} - {format(selectedRange.to,'LLL dd')}
                                    
                                    </> : <span>Schedule Range</span>
                                }
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto bg-black border-none">
                            <Calendar className="bg-black text-white" mode='range' numberOfMonths={2} selected={selectedRange} onSelect={d => setDate(d)} />
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-black text-white w-[200px]">For Days</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-black text-white">
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'sunday', newVal: v})} checked={selectedDays.sunday}>Sunday</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'monday', newVal: v})} checked={selectedDays.monday}>Monday</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'tuesday', newVal: v})} checked={selectedDays.tuesday}>Tuesday</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'wednesday', newVal: v})} checked={selectedDays.wednesday}>Wednesday</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'thursday', newVal: v})} checked={selectedDays.thursday}>Thursday</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'friday', newVal: v})} checked={selectedDays.friday}>Friday</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onCheckedChange={(v) => updateDay({day: 'saturday', newVal: v})} checked={selectedDays.saturday}>Saturday</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                </ParamController>

                <ParamController title="Job Assignment Percentage">
                    
                    <div className="flex flex-col items-center justify-between h-[100%]">
                        <div>
                            <Select onValueChange={v => setSelectedPerson(v)} disabled={!advancedEnabled} >
                                <SelectTrigger className="bg-black">
                                    <SelectValue  placeholder="People"/>
                                </SelectTrigger>
                                <SelectContent className="bg-black text-white">
                                    {names.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col justify-center w-[80%]">
                            {jobs.length > 0 && advancedEnabled ? <div className="flex flex-col text-center gap-3">
                                {jobs.map((j,v) => <JobParameter update={updatePercentages}  isEnabled key={selectedPerson+j}  jobName={j} personName={selectedPerson} percentages={percentages} />)}
                            </div> : <span className="text-center">Select a Person</span>}
                        </div>
                        <div>
                            <span className="">Enabled?</span> <Checkbox onCheckedChange={e => setAdvancedEnabled(e.valueOf() as boolean)} className=""/>
                        </div>
                    </div>
                </ParamController>
            </header>

            <section className="flex justify-center gap-3 my-10 print:hidden">
                <Button className="bg-white text-black hover:bg-slate-200 hover:text-black">Create Preset</Button>
                <Button onClick={() => generate({names: names, jobs: jobs, dateRange: selectedRange as DateRange,days: [],jobPercentages: percentages})} className="bg-white text-black hover:bg-slate-200 hover:text-black">Generate</Button>
                <Button onClick={() => window.print()} className="bg-white text-black hover:bg-slate-200 hover:text-black">Print</Button>
            </section>

            <section className="flex justify-center flex-wrap mb-10">
                <Document/>
            </section>
        </main>
    
    </>)

}