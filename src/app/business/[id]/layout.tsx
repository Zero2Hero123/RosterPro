'use client'
import DashboardTab from "@/components/dashboard-ui/DashboardTab";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { error } from "console";
import { Building, ChevronsUpDown, House, MessageCircleMore, Users } from "lucide-react";
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


    const [user,setUser] = useState({}) 
    const [listOfBusinesses,setListBusinesses] = useState<any[]>([])
    const [selectedBusiness, setSelected] = useState<any | null>(null)

    useEffect(() => {
      supabase.from('business').select().eq('id',params.id)
      .then(({data, error}) => {
        setSelected(data && data[0])

        if(error) console.error(error)
      })

      supabase.from('user_businesses').select().eq('user_id','')
    },[])




    return (
        <>
            <main className="flex">
                <section className="h-[calc(100vh-4rem)] bg-black  lg:basis-[230px] px-3 flex flex-col gap-3">

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex justify-around items-center border border-gray-500 bg-black hover:bg-slate-950 w-20 md:w-auto"> <Building className="md:hidden"/> <span className="grow text-center hidden md:inline">{selectedBusiness ? selectedBusiness.name : 'None'}</span> <ChevronsUpDown size={'18'}/> </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-black text-white w-56">

                    {
                      listOfBusinesses.map(b => <DropdownMenuItem> <span className="text-center grow hover:cursor-pointer">{b.name}</span> </DropdownMenuItem>)
                    }


                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Separator/>

                  <DashboardTab href={`/business/${params.id}`}>  <House/> <span className="grow text-center hidden sm:inline">Home</span> </DashboardTab>
                  <DashboardTab href={`/business/${params.id}/employees`} > <Users/> <span className="grow text-center hidden sm:inline">Employees</span> </DashboardTab>
                  <DashboardTab href={`/business/${params.id}/chat`}> <MessageCircleMore/> <span className="grow text-center hidden sm:inline">Public Chat</span> </DashboardTab>
                  

                </section>
                
                
                <section className="flex justify-start flex-col items-center grow px-2 py-1">{dashboard}</section>
            </main>
        </>
    );
  }