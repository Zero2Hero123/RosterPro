import { createClient } from "@/utils/supabase/server"



export default async function Default(){

    const supabase = createClient()



    return <>
    
        <span className="">test</span>
    
    </>
}