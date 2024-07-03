'use client'
import { Dispatch, SetStateAction } from "react"
import { Button, ButtonProps } from "./ui/button"


interface Props {
    title: string
}

const Segment: React.FC<Props & Pick<ButtonProps,'onClick'>> = ({title,onClick}) => <div className="flex items-center justify-between p-2 bg-gray-800 rounded-md basis-10">
    <span>{title}</span> <Button onClick={onClick} className="bg-red-900 hover:bg-red-950">X</Button>
</div>

export default Segment