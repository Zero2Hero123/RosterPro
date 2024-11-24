'use server'
import Approval from "@/components/time-off-ui/Approval"
import RequestCard from "@/components/time-off-ui/RequestCard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/utils/supabase/server"
import { TabsContent } from "@radix-ui/react-tabs"
import { formatDate } from "date-fns"
import { Check, Clock } from "lucide-react"
import { notFound } from "next/navigation"




interface Props {
    params: Promise<{id: string}>,
    searchParams: Promise<{p: string}>
}


export default async function TimeOffPage({params,searchParams}:Props){

    const { id } = await params
    const { p } = await searchParams
    
    const currPage = Number(p) || 1

    const supabase = await createClient()

    const currUser = await supabase.auth.getUser()
    const currUserProfile = await supabase.from('profiles').select().eq('id',currUser.data.user?.id)
    if(currUserProfile.error){
        console.error(currUser.error?.message)
        notFound()
    }

    const resForEveryone = await supabase.from('time_off_request') // time-off requests for this organization
        .select()
        .eq('business_id',id).range(1*currPage,16*currPage)
    
    const resForIndividual = await supabase.from('time_off_request') // time-off requests for this organization
        .select()
        .eq('business_id',id).eq('user_id',currUser.data.user?.id).range((currPage-1)*15,(currPage-1)+(currPage*15))
    
    if(resForEveryone.error){
        console.error(resForEveryone.error.message)
        notFound()
    } else if(resForIndividual.error) {
        console.error(resForIndividual.error.message)
        notFound()
    }


    const everyone = resForEveryone.data
    const you = resForIndividual.data


    return <>
        <Tabs className="dark flex flex-col items-center gap-2 " defaultValue="you">
            <TabsList>
                <TabsTrigger value='you'>You</TabsTrigger>
                <TabsTrigger value="everyone">Everyone</TabsTrigger>
            </TabsList>

            <div className="basis-[75vh] overflow-y-scroll">
                <TabsContent className="flex flex-wrap gap-2" value="you">

                    {you.map(t => <RequestCard key={`TIME_OFF_${t.id}`} t={t}/>)}

                </TabsContent>

                <TabsContent className="flex flex-wrap gap-2" value="everyone">

                    {everyone.map(t => <RequestCard key={`TIME_OFF_${t.id}`} t={t}/>)}

                </TabsContent>
            </div>
        </Tabs>
        <Pagination className="h-10">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={`?p=${currPage == 1 ? 1 : currPage-1}`} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="?p=1">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href={`?p=${currPage+1}`} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    
    </>
}