import { ReactNode, useEffect, useRef, useState } from "react"




interface Props {
    from: string,
    to: string,
    enabled: boolean,
    children: ReactNode
}


export default function AvailSqaure({children,enabled,to,from}:Props){

    const [isHover,setIsHover] = useState<boolean>(false)
    const div = useRef<HTMLDivElement>(null)

    

    useEffect(() => {
        if(div.current){
            div.current.addEventListener('mouseover',() => {
                setIsHover(true)
            })
            div.current.addEventListener('mouseout',() => {
                setIsHover(false)
            })
        }

        return () => {
            if(div.current){
                div.current.removeEventListener('mouseover',() => {
                    setIsHover(true)
                })
                div.current.removeEventListener('mouseout',() => {
                    setIsHover(false)
                })
            }
        }
    },[])

    const timeContent = <span>{parseTime(from)}-{parseTime(to)}</span>

    return <>
    
        <div ref={div} className={`border hover:cursor-pointer hover:grow-[20] transition-all border-slate-700 grow flex justify-center rounded-sm ${enabled && 'bg-gradient-to-tr from-blue-900 to-blue-500'}`}>{(isHover && enabled) ? timeContent : children}</div>
    
    </>
}

function parseTime(time: string): string {
    if(!time) return '--:--'
    let timeAsInt = Number(time)

    let isAM = true;

    if(timeAsInt == 24){
        return '11:59p'
    }

    if(timeAsInt >= 12){
        timeAsInt -= 12
        isAM = false
    }

    if(timeAsInt == 0){
        timeAsInt = 12;
    }

    // console.log(`${timeAsInt}:00 ${isAM ? 'am' : 'pm'}`)

    return `${timeAsInt}${isAM ? 'a' : 'p'}`
}