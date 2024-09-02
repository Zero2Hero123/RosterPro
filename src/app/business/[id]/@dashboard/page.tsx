import Invite from "@/components/dashboard-ui/Invite";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server"
import { UserRoundPlus, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";


interface Props {
    params: {id: string}
}


export default async function Dashboard({params}: Props){

    const supabase = createClient()

    const res = await supabase.from('business').select().eq('id',params.id)

    if(!res.data) notFound()
    if(!res.data.length) notFound();

    const currBiz = res.data[0];


    const numMembers = await supabase.rpc('numberOfMembers',{
        businessqueryid: currBiz.id
    })


    return <>
        <span className="text-3xl font-bold text-center w-[100%]">{currBiz.name}</span>
        <Link className="hover:cursor-pointer" href={`/business/${params.id}/employees`}> <span className="flex items-center gap-2"> <Users size={'20'}/> {numMembers.data} {numMembers.data != 1 ? 'Employees' : 'Employee'}</span> </Link>
        <Invite/>
    
    </>
}