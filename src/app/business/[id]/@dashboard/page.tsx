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

    const user = await supabase.auth.getUser()
    if(!user.data.user) notFound()

    const {data,error} = await supabase.from('business').select().eq('id',params.id)

    if(!data) notFound()
    if(!data.length) notFound();

    const currBiz = data[0];


    const numMembers = await supabase.rpc('numberOfMembers',{
        businessqueryid: currBiz.id
    })


    return <>
        <span className="text-3xl font-bold text-center w-[100%]">{currBiz.name}</span>
        <Link className="hover:cursor-pointer" href={`/business/${params.id}/employees`}> <span className="flex items-center gap-2"> <Users size={'20'}/> {numMembers.data} {numMembers.data != 1 ? 'Employees' : 'Employee'}</span> </Link>
        {currBiz.owner_id == user.data.user.id && <Invite businessName={currBiz.name} businessId={currBiz.id}/>}
    
    </>
}