'use client'

import Document from "@/components/document-ui/Document";
import JobParameter from "@/components/JobParameter";
import ParamController from "@/components/ParamController";
import PresetCard from "@/components/PresetCard";
import Segment from "@/components/Segment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import generate, { GenerateResponse, savePreset } from "@/utils/actions";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { addDays, format } from "date-fns";
import { CalendarIcon, LoaderCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useTransition } from "react";
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

type OverWrite = {
    type: 'overwrite',
    percentages: PercentagesMap
}

type JobPercentagesReducer = (percentages: PercentagesMap,action: Action | SetAction | OverWrite) => PercentagesMap

const reducer: JobPercentagesReducer = (percentages,action) => {

    // console.info('ACTION ',action)

    const jobMap: Jobs = {}
    if(action.type != 'set-job' && action.type != 'overwrite'){
        for(let job of action.jobs){
            jobMap[job] = 100
        }
    }

    if(action.type == 'set-job'){
        const newMap = new Object(percentages) as PercentagesMap

        newMap[action.forName][action.prop] = action.percentValue;

        return newMap;
    }

    if(action.type != 'overwrite' && action.propType == 'name' && action.prop.length > 0){
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

    } else if(action.type != 'overwrite' && action.propType == 'job' && action.prop.length > 0){
        
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
    } else if(action.type == 'overwrite'){
        return action.percentages
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

    const { toast } = useToast()

    const [client,setClient] = useState<SupabaseClient>(createClient())

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

            return {
                ...prev,
                [dayInfo.day]: dayInfo.newVal
            }
        })

    }

    const [advancedEnabled,setAdvancedEnabled] = useState<boolean>(false)

    const [,forceUpdate] = useReducer(prev => prev+1,0)


    const [percentages,dispatch] = useReducer(reducer,{})
    
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

    const [generatedSchedule,setSchedule] = useState<GenerateResponse[] | null>(null)
    const [isGenerating,startTransition] = useTransition()

    const gen = useCallback(async () => {
        let data = {names: names, jobs: jobs, dateRange: selectedRange as DateRange,days: chosenDays.map(d => d+'s'),advancedEnabled: advancedEnabled,jobPercentages: percentages}
        
        startTransition(async () => {
            const res = await fetch('/api/generate',{method: 'POST', body: JSON.stringify(data)})
            setSchedule(await res.json())
        })
    },[names,jobs,selectedDays,selectedRange])

    const paginatedSchedule = useMemo(() => {
        let paginated: GenerateResponse[][] = []

        if(generatedSchedule){
            let onePage = []
            let i = 0;
            while(i < generatedSchedule.length){
                onePage.push(generatedSchedule[i])
                if((i % 8 == 0 && i != 0) || i == generatedSchedule.length-1){
                    paginated.push(onePage)
                    onePage = []
                }
                i++;
            }
        }

        console.log('PAGES', paginated)

        return paginated

    },[generatedSchedule])

    useEffect(() => {
        console.log('SCHEDULE',generatedSchedule)
    },[generatedSchedule])

    // Quick validation
    function quickCheck(){
        if(names.length > jobs.length){
            toast({
                title: "Warning",
                description:"There are more people than jobs. Not everyone will have be assigned a job.",
                action: <ToastAction onClick={() => gen()} altText={"Ok"}>Ok</ToastAction>
            })
        } else if(jobs.length > names.length){
            toast({
                title: "Warning",
                description:"There are more jobs than people. Not every job will assigned to a person.",
                action: <ToastAction onClick={() => gen()} altText={"Ok"}>Ok</ToastAction>
            })
        } else if(names.length == 0 || jobs.length == 0){
            toast({
                title: "Error",
                variant: 'destructive',
                description:"Both the Names and Jobs paramters should have atleast one entry."
            })
        } else {
            gen()
        }
    }
    //...

    // Handling Presets
    const channelA = client
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public'
      },
      () => updatePresets()
    )
    .subscribe()

    const [myPresets,setPresets] = useState<any[]>([])
    const [enteredTitle,setPresetTitle] = useState('')

    const updatePresets = useCallback(() => {
        client.from('presets').select()
            .then((res) => {
                if(res.data) setPresets(res.data)
                console.log('PRESETS',res.data)
                setPresetTitle('')
            })
    },[])

    const loadPreset = useCallback((id: string) => {
        client.from('presets').select().eq('id',id)
            .then(res => {
                if(res.data){
                    const preset = res.data[0]

                    setNames(preset.names)
                    setJobs(preset.jobs)
                    setDate(preset.date_range)
                    dispatch({type: 'overwrite', percentages: preset.job_percentages})

                    toast({
                        title: `Successfully Loaded Preset ${preset.title}!`
                    })
                }

            })
    },[])

    useEffect(() =>{
        console.log('DAYS',selectedDays)
    },[selectedDays])

    useEffect(() => {
        updatePresets()
    },[])

    return (<>
    
        <main>
            <span className="flex justify-center text-3xl font-medium print:hidden">Person-Job Scheduler</span>
            
            <header className="flex justify-center gap-2 flex-wrap print:hidden">
                <ParamController title="People">
                    <div className="flex gap-2 px-2 py-3">
                        <Input onKeyDown={e => e.key == 'Enter' && addNameBtnRef.current?.click()} ref={nameInputRef} className="bg-black" onChange={e => setEnteredName(e.target.value)} placeholder="Name" />
                        <Button disabled={isGenerating} ref={addNameBtnRef} className="bg-white text-black hover:bg-slate-300" onClick={() => {
                            if(enteredName.length == 0 || isGenerating) return;
                            if(names.indexOf(enteredName) != -1) {toast({ title: 'Error', description: `Person with name, ${enteredName}, already exists.`, variant: "destructive" }); setEnteredName(''); return;}
                            
                            
                            dispatch({prop: enteredName, propType: 'name',type: 'add',names: names,jobs: jobs})

                            setNames(prev => {
                            if(nameInputRef.current) nameInputRef.current.value = ''
                            return [...prev,enteredName]
                        }); setEnteredName('')}}> <Plus/> </Button>
                    </div>
                
                    
                    <ScrollArea className="h-[80%] max-h-[71%]">
                        <div className="flex flex-col pt-6 px-4 gap-2">
                            {names.map(name => <Segment key={name} onClick={() => removeName(name)} title={name}/>)}
                        </div>
                    </ScrollArea>

                </ParamController>

                <ParamController title="Jobs">
                    <div className="flex gap-2 px-2 py-3">
                        <Input onKeyDown={e => e.key == 'Enter' && addJobBtn.current?.click()} ref={jobInputRef} className="bg-black" onChange={e => setEnteredJob(e.target.value)} placeholder="Job or Task" />
                        <Button disabled={isGenerating} ref={addJobBtn} className="bg-white text-black hover:bg-slate-300" onClick={() => {
                            if(enteredJob.length == 0 || isGenerating) return;
                            if(jobs.indexOf(enteredJob) != -1) {toast({ title: 'Error', description: `Job with name, ${enteredName}, already exists.`, variant: "destructive" }); setEnteredJob(''); return;}
                            
                            
                            dispatch({prop: enteredJob, propType: 'job',type: 'add',names: names,jobs: jobs});
                            setJobs(prev => {
                            
                            if(jobInputRef.current)jobInputRef.current.value = ''
                            return [...prev,enteredJob]
                        }); setEnteredJob('');}}> <Plus/> </Button>
                    </div>

            
                
                    <ScrollArea className="h-[80%] max-h-[71%]">
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

                <ParamController title="Job Assignment Percentage (Beta)">
                    
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
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-white text-black hover:bg-slate-200 hover:text-black">My Presets</Button>
                    </SheetTrigger>
                    <SheetContent className="bg-black text-white">
                        <SheetHeader>
                            <SheetTitle className="text-white">My Presets</SheetTitle>

                            <SheetDescription>Save & Load presets of the parameters you configure.</SheetDescription>
                        </SheetHeader>
                        
                        <div>
                            <div className="flex flex-col">
                                <span className="font-medium text-2xl text-center">Create New Preset</span>
                                <div className="flex gap-2">
                                    <Input value={enteredTitle} onChange={e => setPresetTitle(e.target.value)} className="bg-black" placeholder="Preset Title" />
                                    <Button onClick={() => savePreset({title: enteredTitle,names: names, jobs: jobs, date_range: selectedRange!,job_percentages: percentages})} className="bg-white text-black hover:bg-slate-300">Save</Button>
                                </div>
                            </div>
                            <div className="p-4">

                                {myPresets.map(p => <PresetCard loadPreset={loadPreset} key={p.id} id={p.id} title={p.title} names={p.names} jobs={p.jobs} date_range={p.date_range} />)}

                                {/* list of Presets */}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>            


                <Button disabled={isGenerating} onClick={() => quickCheck()} className="bg-white text-black hover:bg-slate-200 w-[100px] hover:text-black">{isGenerating ? <LoaderCircle className="animate-spin"/> : 'Generate' } </Button>
                <Button disabled={isGenerating} onClick={() => window.print()} className="bg-white text-black hover:bg-slate-200 hover:text-black">Print</Button>
            </section>

            <section className="flex justify-center flex-wrap mb-10 gap-3">
                {
                    paginatedSchedule.map((v,i) => <Document key={'DAY'+i} names={names} days={v}/>)
                }
            </section>
        </main>
    
    </>)

}