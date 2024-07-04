'use client'

import { Action, PercentagesMap, SetAction } from "@/app/dashboard/scheduler/page";
import { Slider } from "./ui/slider";
import { Dispatch, useMemo, useState } from "react";


interface Props {
    jobName: string;
    percentages: PercentagesMap;
    personName: string;
    isEnabled: boolean;
    update: (props: {percent: number,forName: string,job: string}) => void
}

const JobParameter: React.FC<Props> = ({jobName,percentages,personName,isEnabled,update}) => {

    if(!percentages[personName]){
        return <></>
    }

    // const [percent,setPercent] = useState(percentages[personName][jobName])


    return <div>
        <span className="font-medium">{jobName}: {percentages[personName][jobName]}% </span>
        <Slider onValueChange={v => update({percent: v[0],forName: personName,job: jobName})} disabled={!isEnabled} className="w-[100%]" defaultValue={[percentages[personName][jobName]]} max={100}/>
    </div>

}


export default JobParameter;