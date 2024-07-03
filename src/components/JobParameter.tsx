'use client'

import { PercentagesMap } from "@/app/dashboard/scheduler/page";
import { Slider } from "./ui/slider";
import { useState } from "react";


interface Props {
    jobName: string;
    percentages: PercentagesMap;
    personName: string;
    isEnabled: boolean;
}

const JobParameter: React.FC<Props> = ({jobName,percentages,personName,isEnabled}) => {

    if(!percentages[personName]){
        return <></>
    }

    const [percent,setPercent] = useState(percentages[personName][jobName])

    return <div>
        <span className="font-medium">{jobName}: {percent}% </span>
        <Slider onValueChange={v => setPercent(v[0])} disabled={!isEnabled} sliderColor="bg-green-500" className="w-[100%]" defaultValue={[percentages[personName][jobName]]} max={100}/>
    </div>

}


export default JobParameter;