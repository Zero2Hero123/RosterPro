





interface Props {
    firstName: string;
    lastName: string;
    size: number
}


export default async function ProfilePic({firstName,lastName,size}: Props){

    return <>
    
        <div className={`rounded-full flex justify-center items-center md:h-20 md:w-20 h-12 w-12 bg-gradient-to-tr from-blue-600 to-blue-900 p-3 hover:cursor-pointer mx-1`}>
            <span className=" font-medium text-2xl md:text-4xl">{getInitials(firstName,lastName)}</span>
        </div>
    
    </>
}

function getInitials(firstName: string,lastName: string){

    return (firstName.substring(0,1) + lastName.substring(0,1)).toUpperCase()
}