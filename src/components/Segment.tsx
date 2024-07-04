'use client'
import { Dispatch, SetStateAction } from "react"
import { Button, ButtonProps } from "./ui/button"
import { Trash2 } from "lucide-react"


interface Props {
    title: string
}

const Segment: React.FC<Props & Pick<ButtonProps,'onClick'>> = ({title,onClick}) => <div className="group flex items-center justify-between p-2 bg-black rounded-md basis-10">
    <span className="">{title}</span> <Button onClick={onClick} className="bg-red-900 hover:bg-red-950 w-12"> <Trash2/> </Button>
</div>

export default Segment