'use client'
import DashboardTab from "@/components/dashboard-ui/DashboardTab";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { House, MessageCircleMore, Users } from "lucide-react";
import { usePathname } from "next/navigation";







export default function Layout({
    children,
    dashboard,
    params
  }: Readonly<{
    children: React.ReactNode;
    dashboard: React.ReactNode;
    params: {id: string}
  }>) {


    return (
        <>
            <main className="flex">
                <section className="h-[91.7vh] bg-black lg:basis-[230px] p-3 flex flex-col gap-3">

                  <Separator/>

                  <DashboardTab href={`/business/${params.id}`}>  <House/> <span className="grow text-center hidden sm:inline">Home</span> </DashboardTab>
                  <DashboardTab href={`/business/${params.id}/employees`} > <Users/> <span className="grow text-center hidden sm:inline">Employees</span> </DashboardTab>
                  <DashboardTab href={`/business/${params.id}/chat`}> <MessageCircleMore/> <span className="grow text-center hidden sm:inline">Public Chat</span> </DashboardTab>
                  

                </section>
                
                
                <section className="flex justify-start flex-col items-center grow p-5">{dashboard}</section>
            </main>
        </>
    );
  }