import { Slider } from "./ui/slider";


interface Props {
    jobName: string;
    percentage: number;
}

const JobParameter: React.FC<Props> = ({jobName,percentage}) => <div>
    <span className="font-medium">{jobName}: {percentage}% </span>
    <Slider className="basis-[70%]" max={100}/>
</div>


export default JobParameter;