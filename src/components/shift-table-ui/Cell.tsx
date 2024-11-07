'use client'
interface Props {
    index: number
}

const Cell: React.FC<Props> = async ({index}) => {


    return <div data-swapy-slot={index} className="border"></div>
}


export default Cell;