import { GenerateResponse } from "@/utils/actions"
import TextLabel from "./TextLabel"
import { useEffect, useRef } from "react"
import { createSwapy } from "swapy"
import { Span } from "next/dist/trace"


interface Props {
    names: string[]
    day: GenerateResponse
}

const Row: React.FC<Props> = ({day,names}) => {

    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        
        const swapy = createSwapy(container.current)

        swapy.enable(true)
    })


    return <>
        <div>
            <hr/>
            <div ref={container} className="flex justify-between">
                <div className="grow">
                    {
                        names.map((n,i) => <div key={n+i} data-swapy-slot={i} className="h-6 grow hover:cursor-pointer hover:bg-gray-100"> <div data-swapy-item={n} >{n}</div> </div>)
                    }
                </div>
                <div className="flex flex-col">
                    {
                        names.map((n,i) => <span key={n+i+day.day} className="flex justify-end">{day.assignments[n] && day.assignments[n].trim().length > 0 ? day.assignments[n] : '-'}</span>)
                    }
                </div>
            </div>
        </div>
        <div className="w-full flex flex-col">
            <hr/>
            <span className="font-medium text-xl text-right w-full">{day.day}</span>
        </div>
    
    </>
}

export default Row;