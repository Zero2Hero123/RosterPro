'use client'

import { ReactNode } from "react";

interface Props {
    children?: ReactNode
}

const Cell: React.FC<Props> = ({children}) => {

    // data-swapy-slot={index}

    return <div className="border text-black flex justify-center">{children}</div>
}


export default Cell;