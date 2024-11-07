'use client'
interface Props {
    index: number
}

const Cell: React.FC<Props> = ({index}) => {


    return <div data-swapy-slot={index} className="border"></div>
}


export default Cell;