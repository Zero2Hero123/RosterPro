import { GenerateResponse } from "@/utils/actions"
import TextLabel from "./TextLabel"


interface Props {
    names: string[]
    day: GenerateResponse
}

const Row: React.FC<Props> = ({day,names}) => {


    return <>
        <div>
            <hr/>
            <ul>
                {
                    names.map(n => <li className="flex justify-between"> <TextLabel name={n}/> <span>{day.assignments[n]}</span></li>)
                }
            </ul>
        </div>
        <div className="w-full flex flex-col">
            <hr/>
            <span className="font-medium text-xl text-right w-full">{day.day}</span>
        </div>
    
    </>
}

export default Row;