
import { Badge } from "@/components/ui/badge"
import { Calendar as Cal} from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/utils/supabase/server"
import { TabsContent } from "@radix-ui/react-tabs"
import { formatDate } from "date-fns"
import { Check, Clock } from "lucide-react"
import { notFound } from "next/navigation"




interface Props {
    params: Promise<{id: string}>
}


export default async function TimeOffPage({params}:Props){

    const { id } = await params

    const supabase = await createClient()

    const currUser = await supabase.auth.getUser()
    const currUserProfile = await supabase.from('profiles').select().eq('id',currUser.data.user?.id)
    if(currUserProfile.error){
        console.error(currUser.error?.message)
        notFound()
    }

    const res = await supabase.from('time_off_request')
        .select()
        .eq('business_id',id)
    
    if(res.error){
        console.error(res.error.message)
        notFound()
    }
    const everyone = res.data
    const you = everyone.filter(t => t.user_id === currUser.data.user?.id)

    console.log('me',you)
    console.log('everyone',everyone)


    return <>
        <Tabs className="dark flex flex-col items-center" defaultValue="you">
                <TabsList>
                    <TabsTrigger value='you'>You</TabsTrigger>
                    <TabsTrigger value="everyone">Everyone</TabsTrigger>
                </TabsList>

                <TabsContent className="flex flex-wrap gap-3 overflow-y-scroll h-[86vh]" value="you">

                    {you.map(t => <Card className="pt-3 px-1 h-40" key={`TIME_OFF_${t.id}`}>
                        <CardTitle className="font-medium">{currUserProfile.data[0].first_name} {currUserProfile.data[0].last_name}</CardTitle>
                        <CardContent>{formatDate(t.from,"MMMM dd, yyyy")} to {formatDate(t.to,"MMMM dd, yyyy")}</CardContent>
                        <CardFooter>
                            {t.approved ? <Badge variant={'outline'}><Check size={14}/>  Approved</Badge> : <Badge className="flex gap-1" variant={'secondary'}> <Clock size={14}/> Awaiting Approval</Badge>}
                        </CardFooter>
                    </Card>)}

                </TabsContent>

                <TabsContent value="everyone">

                    everyone

                </TabsContent>
            </Tabs>
    
    </>
}