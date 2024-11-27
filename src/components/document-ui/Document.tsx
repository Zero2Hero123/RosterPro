import { GenerateResponse } from "@/utils/actions";
import Row from "./Row";


interface Props {
    days: GenerateResponse[]
    names: string[]
}

const Document: React.FC<Props> = ({days,names}) => {

    return (<div className="bg-white p-4 text-black w-[65%] max-w-[800px] print:w-[850px] print:h-[952px] aspect-[17/22] ">
        
        <div className="grid grid-rows-5 grid-cols-2">
            {
                days.map((d,i) => <Row key={d+`${Math.random()}`} day={d} names={names}/>)
            }
        </div>

    </div>)

}

export default Document;