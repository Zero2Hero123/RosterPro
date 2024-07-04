'use client'

import Document from "@/components/Document";
import JobParameter from "@/components/JobParameter";
import ParamController from "@/components/ParamController";
import Segment from "@/components/Segment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";

// TODO Establish state of job-percent accessible in parent

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

    if(action.propType == 'name'){
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

    } else if(action.propType == 'job'){
        
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

    const [advancedEnabled,setAdvancedEnabled] = useState<boolean>(false)

    const [,forceUpdate] = useReducer(prev => prev+1,0)


    const [percentages,dispatch] = useReducer(reducer,{})

    useEffect(() => {
        console.log(percentages)
    ,[percentages]})
    
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
                        <Button ref={addNameBtnRef} className="bg-gray-800" onClick={() => {
                            dispatch({prop: enteredName, propType: 'name',type: 'add',names: names,jobs: jobs})

                            setNames(prev => {
                            if(nameInputRef.current) nameInputRef.current.value = ''
                            return [...prev,enteredName]
                        });}}>Add</Button>
                    </div>
                
                    
                    <ScrollArea className="h-[80%] max-h-[79%]">
                        <div className="flex flex-col pt-6 px-4 gap-2">
                            {names.map(name => <Segment key={name} onClick={() => removeName(name)} title={name}/>)}
                        </div>
                    </ScrollArea>

                </ParamController>

                <ParamController title="Job">
                    <div className="flex gap-2 px-2">
                        <Input onKeyDown={e => e.key == 'Enter' && addJobBtn.current?.click()} ref={jobInputRef} className="bg-black" onChange={e => setEnteredJob(e.target.value)} placeholder="Job or Task" />
                        <Button ref={addJobBtn} className="bg-gray-800" onClick={() => {
                            dispatch({prop: enteredJob, propType: 'job',type: 'add',names: names,jobs: jobs});
                            setJobs(prev => {
                            
                            if(jobInputRef.current)jobInputRef.current.value = ''
                            return [...prev,enteredJob]
                        });}}>Add</Button>
                    </div>

            
                
                    <ScrollArea className="h-[80%] max-h-[79%]">
                        <div className="flex flex-col pt-6 px-4 gap-2 ">
                            {jobs.map(job => <Segment key={job} onClick={() => removeJob(job)} title={job}/>)}
                        </div>
                    </ScrollArea>
                    
            
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
                <Button className="bg-white text-black hover:bg-slate-200 hover:text-black">Generate</Button>
                <Button onClick={() => window.print()} className="bg-white text-black hover:bg-slate-200 hover:text-black">Print</Button>
            </section>

            <section className="flex justify-center flex-wrap">
                <Document/>
                <Document/>
            </section>
        </main>
    
    </>)

}