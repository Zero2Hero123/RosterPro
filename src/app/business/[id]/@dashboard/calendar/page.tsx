import { Calendar as Cal} from "@/components/ui/calendar"





interface Props {
    params: {id: string}
}


export default function Calendar({params}:Props){


    return <>
    
        <main className="w-full grow flex border border-white">
            <div className="w-full flex justify-center">
                <Cal />
            </div>
            <div>test</div>

        </main>         
    
    </>
}