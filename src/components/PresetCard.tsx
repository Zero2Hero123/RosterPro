'use client'

import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deletePreset } from "@/utils/actions";
import { useState } from "react";


interface Preset {
    id: string,
    names: string[]
    jobs: string[],
    date_range: DateRange,
    title: string,

    loadPreset: (id: string) => void
}

const PresetCard: React.FC<Preset> = ({names,jobs,date_range,title,id,loadPreset}) => {


    return <>

        <Popover>
            <PopoverTrigger asChild>
                <div className="border-slate-700 border rounded-md p-2 hover:border-white hover:cursor-pointer transition-all">
                    <span className="text-2xl">{title}</span>
                    <div>{names.join(',')}</div>
                    <div>{jobs.join(',')}</div>
                </div>
            </PopoverTrigger>

            <PopoverContent className="bg-black w-auto border-none">

                <div className="flex gap-2">
                    <Button onClick={ () => loadPreset(id) } className="bg-white text-black hover:bg-slate-300"> Load </Button>
                    
                    <Button onClick={() => deletePreset(id)} className="bg-red-500 hover:bg-red-700"> <Trash2/> </Button>
                </div>

            </PopoverContent>
        </Popover>

    </>
}

export default PresetCard;