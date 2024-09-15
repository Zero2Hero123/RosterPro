'use client'
import DashboardTab from "@/components/dashboard-ui/DashboardTab";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Building, ChevronsUpDown, House, LoaderCircle, MessageCircleMore, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";







export default function Layout({
    children,
    dashboard,
    params
  }: Readonly<{
    children: React.ReactNode;
    dashboard: React.ReactNode;
    params: {id: string}
  }>) {

    const supabase = createClient()
    // TODO finish business dropdown


    const [user,setUser] = useState<User | null>(null) 
    const [listOfBusinesses,setListBusinesses] = useState<any[] | null>([])
    const [selectedBusiness, setSelected] = useState<any | null>(null)

    useEffect(() => {
      supabase.auth.getUser().then(res => {
        setUser(res.data.user)
      })
    },[])

    useEffect(() => {
      supabase.from('business').select().eq('id',params.id)
      .then(({data, error}) => {
        if(error) console.warn(error)

        setSelected(data && data[0])

      })
      
      if(!user) return
      supabase.from('user_businesses').select().eq('user_id',user?.id)
      .then(({data,error}) => {
        if(error) console.warn(error)

        setListBusinesses(data)
      })
      
    },[user])






    return (
        <>
            <main className="flex">
                <section className="h-[calc(100vh-4rem)] bg-black  lg:basis-[230px] px-3 flex flex-col gap-3">

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex justify-around items-center border border-gray-500 bg-black hover:bg-slate-950"> <span className="grow text-center">{selectedBusiness ? selectedBusiness.name : 'None'}</span> <ChevronsUpDown size={'18'}/> </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-black text-white w-56">

                    {
                      listOfBusinesses && listOfBusinesses.map(b => <DropdownMenuItem key={'LIST_'+b.business_id} className="p-0"> <BusinessLink businessId={b.business_id} /> </DropdownMenuItem>)
                    }


                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Separator/>

                  <DashboardTab href={`/business/${params.id}`}>  <House/> <span className="grow text-center hidden sm:inline">Home</span> </DashboardTab>
                  <DashboardTab href={`/business/${params.id}/employees`} > <Users/> <span className="grow text-center hidden sm:inline">Employees</span> </DashboardTab>
                  <DashboardTab href={`/business/${params.id}/chat`}> <MessageCircleMore/> <span className="grow text-center hidden sm:inline">Public Chat</span> </DashboardTab>
                  
                  <Separator/>

                  <DashboardTab href={`/business/${params.id}/settings`}> <Settings /> <span className="grow text-center hidden sm:inline">Settings</span> </DashboardTab>

                </section>
                
                
                <section className="flex justify-start flex-col items-center grow px-2 py-1">{dashboard}</section>
            </main>
        </>
    );
  }

function BusinessLink({businessId}: {businessId: string}){

  const [business,setBusiness] = useState<any| null>(null)

  const supabase = createClient()

  useEffect(() => {
  
    supabase.from('business').select().eq('id',businessId)
    .then((res) => {
      setBusiness(res.data && res.data[0])
    })

  },[])

  
  return <Link href={`/business/${businessId}`} className="text-center grow hover:cursor-pointer inline px-1 py-2">{business ? business.name : <LoaderCircle className="animate-spin text-center" />}</Link>
}