import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"


interface Props {
    params: Promise<{id: string}>
}

export default async function BusinessDashboard(props: Props) {
    const params = await props.params;

    const supabase = createClient()

    const res = await supabase.from('business').select().eq('id',params.id)

    if(!res.data) notFound();


    return <>
    
        test
    
    </>
}