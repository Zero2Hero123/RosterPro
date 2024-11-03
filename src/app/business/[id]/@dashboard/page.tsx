import ProfilePic from "@/components/ProfilePic";
import DatePicker from "@/components/dashboard-ui/DatePicker";
import Invite from "@/components/dashboard-ui/Invite";
import TimeOffRequestForm from "@/components/dashboard-ui/TimeOffRequestForm";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { requestTimeOff } from "@/utils/actions";
import { createClient } from "@/utils/supabase/server"
import { CalendarCog, Clock, UserRoundPlus, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";


interface Props {
    params: Promise<{id: string}>
}


export default async function Dashboard(props: Props) {
    const params = await props.params;

    const supabase = createClient()

    // fetch signined-in user
    const user = await supabase.auth.getUser()
    if(!user.data.user) notFound()

    const profiles = (await supabase.from('profiles').select().eq('id',user.data.user.id)).data
    if(!profiles) notFound()
    const profile = profiles[0]
    // ...

    const {data,error} = await supabase.from('business').select().eq('id',params.id)

    if(!data) notFound()
    if(!data.length) notFound();

    const currBiz = data[0];


    const numMembers = await supabase.rpc('numberOfMembers',{
        businessqueryid: currBiz.id
    })


    return <>
        <span className="text-3xl font-bold text-center w-[100%]">{currBiz.name}</span>
        <Link className="hover:cursor-pointer mb-10" href={`/business/${params.id}/employees`}> <span className="flex items-center gap-2"> <Users size={'20'}/> {numMembers.data} {numMembers.data != 1 ? 'Employees' : 'Employee'}</span> </Link>
        {currBiz.owner_id == user.data.user.id && <Invite businessName={currBiz.name} businessId={currBiz.id}/>}
        
        <header className="flex w-full justify-center">
            <ProfilePic firstName={profile.first_name} lastName={profile.last_name} size={20} />
            <div className="flex flex-col">
                
                <span className="text-md md:text-xl">Welcome,</span>
                <span className="text-xl md:text-5xl font-medium">{profile.first_name} {profile.last_name}</span>
            </div>
        </header>
        <main className="w-full flex justify-center items-center p-6">
            <div className="flex flex-col w-[50%] gap-4 items-center">
                
                
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="min-w-[200px] w-full">
                            <CardHeader>
                                <CardTitle className="flex gap-1"> Request time off</CardTitle>
                                <CardDescription>Make a request for time off.</CardDescription>
                            </CardHeader>
                        </Card>
                    </DialogTrigger>


                    <DialogContent className="bg-black border-slate-600">
                        <DialogHeader>
                            <DialogTitle>Time Off Request Form</DialogTitle>
                        </DialogHeader>

                        <TimeOffRequestForm businessId={params.id} />
                    </DialogContent>
                </Dialog>
                
                
                <Link href={`/business/${params.id}/availability`} className="w-full">

                    <Card className="min-w-[200px] w-full">
                        <CardHeader>
                            <CardTitle className="flex gap-1"> Change my Availability</CardTitle>
                            <CardDescription>Change your availability to suit you.</CardDescription>
                        </CardHeader>
                    </Card>
                
                </Link>
            </div>
        </main>
    </>
}
