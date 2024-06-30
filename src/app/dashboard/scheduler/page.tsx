

export default function Scheduler(){


    return (<>
    
        <main>
            <span className="flex justify-center text-3xl">Person-Job Scheduler</span>
            <header className="flex justify-center gap-2 ">
                <div className="basis-[350px] h-[300px] flex flex-col items-center shadow-md rounded-sm">
                    <span>People</span>
                </div>

                <div className="basis-[350px] h-[300px] flex flex-col items-center shadow-md rounded-sm">
                    <span>Jobs</span>
                </div>

                <div className="basis-[350px] h-[300px] flex flex-col items-center shadow-md rounded-sm">
                    <span>Job Assignment Percentage</span>
                </div>
            </header>
        </main>
    
    </>)

}