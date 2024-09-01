'use server'

import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

interface Props {
    params: {id : string}
}

export default async function BusinessDashboard({params}: Props){

    const supabase = createClient()

    const res = await supabase.from('business').select().eq('id',params.id)

    if(!res.data) notFound()


    return (<>
    
    
        <main>
            <section className="bg-black h-screen w-40"></section>
            <section></section>
        </main>
    
    
    </>)
}