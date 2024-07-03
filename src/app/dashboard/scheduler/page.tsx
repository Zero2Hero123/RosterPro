'use client'

import JobParameter from "@/components/JobParameter";
import ParamController from "@/components/ParamController";
import Segment from "@/components/Segment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";



type Jobs = {
    [key: string]: number
}

type PercentagesMap = {
    [key: string]: Jobs
}

type JobPercentagesReducer = (percentages: PercentagesMap,action:{prop: string, propType: 'name' | 'job', type: 'add' | 'remove',names: string[], jobs: string[]}) => PercentagesMap

const reducer: JobPercentagesReducer = (percentages,action) => {

    const jobMap: Jobs = {}
    for(let job of action.jobs){
        jobMap[job] = 100
    }


    const newMap: PercentagesMap = new Object(percentages) as PercentagesMap

    if(action.propType == 'name'){
        if(action.type == 'add'){
            newMap[action.prop] = new Object(jobMap) as Jobs
        } else if(action.type == 'remove'){
            delete newMap[action.prop]
        }

    } else if(action.propType == 'job'){
        if(action.type == 'add'){
            action.names.forEach(name => newMap[name][action.prop] = 100)
        
        } else if(action.type == 'remove'){
            action.names.forEach(name => delete newMap[name][action.prop])
        }
    }

    return newMap;
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
        console.log('before: ',newNames)

        const idx = newNames.indexOf(name)

        newNames.splice(idx,1)
        console.log('after: ',newNames)

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



    return (<>
    
        <main>
            <span className="flex justify-center text-3xl font-medium">Person-Job Scheduler</span>
            
            <header className="flex justify-center gap-2 flex-wrap ">
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
                                <SelectContent className="bg-black">
                                    {names.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-center w-[80%]">
                            {jobs.length > 0 ? <div>
                                {jobs.map(j => <JobParameter key={selectedPerson+j} jobName={j} percentage={percentages[selectedPerson][j]} />)}
                            </div> : <span>No Jobs added</span>}
                        </div>
                        <div>
                            <span className="">Enabled?</span> <Checkbox onCheckedChange={e => setAdvancedEnabled(e.valueOf() as boolean)} className=""/>
                        </div>
                    </div>
                </ParamController>
            </header>
        </main>
    
    </>)

}