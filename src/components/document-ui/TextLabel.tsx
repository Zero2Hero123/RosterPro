import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import { Input } from "../ui/input";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";


interface Props {
    name: string
}

const TextLabel: React.FC<Props> = ({name}) => { // TODO Work on editable text field for document

    const [displayedName,setDisplay] = useState(name)
    const [enteredName,setEnteredName] = useState('')

    function changeName(){
        if(enteredName.length > 0){
            setDisplay(enteredName);
        }

        setEnteredName('')

    }

    return <Popover>
        <PopoverTrigger asChild>
            
        <Button className="bg-white text-black h-8 hover:bg-white hover:border border-black">{displayedName}</Button>

        </PopoverTrigger>
        <PopoverContent className="bg-black border-none shadow-md">
            <div className="flex gap-2">
                <Input value={enteredName} onKeyDown={e => e.key == 'Enter' && changeName()} onChange={(e) => setEnteredName(e.target.value)} className="bg-black text-white" placeholder={displayedName}/>
                <Button onClick={() => changeName()} className="bg-green-500 text-white w-14 hover:bg-green-700 "> <Check/> </Button>
            </div>
        </PopoverContent>
    </Popover>
}

export default TextLabel;