import { ReactNode } from "react";

interface Props {
    title: string;
    children: ReactNode;
}


const ParamController: React.FC<Props> = ({title, children}) => {

    

    return (
    <div className="basis-[350px] h-[300px] my-2 flex flex-col items-center shadow-md rounded-sm bg-[#1c1c1c]">
        <div><span>{title}</span></div>
        <div className="w-[100%] h-[100%]">
            {children}
        </div>
    </div>)
}

export default ParamController;