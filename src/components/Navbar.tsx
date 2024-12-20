'use server'
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Image from "next/image";

import logo from '@/../public/icon.png'
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { signOut } from "@/utils/actions";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import ServiceDisplayCard from "./ServiceDisplayCard";
import BusinessLink from "./dashboard-ui/BusinessLink";
import { Building2, ChevronsRight } from "lucide-react";
import MailBtn from "./mail-notif-ui/MailBtn";

const toolsAndServices = [
    {
        title: 'AssignFlow',
        desc: "Dyanmically create schedules in which people's names map to assigned jobs.",
        href: '/scheduler/assign-flow'
    },
    {
        title: 'Shift Sheet',
        desc: "Create Clean shift timesheets for your business with ease.",
        href: '/scheduler/shift-sheet'
    },
]


function getInitials(firstName: string,lastName: string){

    return (firstName.substring(0,1) + lastName.substring(0,1)).toUpperCase()
}

const Navbar: React.FC = async () => {

    const client = await createClient()
    const user = await client.auth.getUser()

    const id = user.data.user?.id
    
    let myProfile: any;

    const profiles = await client.from('profiles').select().eq('id',id)
    if(profiles.data){
        myProfile = profiles.data![0]
    }

    const listOfBusinesses = await (await client.from('user_businesses').select().eq('user_id',user.data.user?.id)).data


    return (
        <nav className="bg-black h-16 flex items-center print:hidden justify-between">

            <div className="flex">
                <Link href='/'><Image className="" src={logo} alt='logo' width={60} height={60} /></Link>
                <NavigationMenu>
                    <NavigationMenuItem className="dark bg-black text-black w-fit flex items-center">
                        <NavigationMenuTrigger >Tools & Services</NavigationMenuTrigger>

                        <NavigationMenuContent className="bg-black text-white">
                            <div className="grid grid-cols-2 grid-rows-2 gap-3 w-[500px] h-[300px] p-6">
                                {toolsAndServices.map(t => <ServiceDisplayCard key={t.title} title={t.title} desc={t.desc} href={t.href} />)}
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenu>
            </div>

            {myProfile ? <div className="flex items-center gap-2">
                <MailBtn/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="flex justify-around items-center border border-gray-500 bg-black hover:bg-slate-950 gap-2"> <span className="grow text-center hidden md:inline"> Dashboard </span> <Building2 />  </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-black text-white w-56">

                    {
                        listOfBusinesses && listOfBusinesses.map(b => <DropdownMenuItem key={'LIST_'+b.business_id} className="p-0"> <BusinessLink businessId={b.business_id} /> </DropdownMenuItem>)
                    }


                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <div className={`rounded-full flex justify-center items-center h-12 w-12 bg-gradient-to-tr from-blue-600 to-blue-900 p-3 hover:cursor-pointer mx-2`}>
                        <span className=" font-medium text-2xl">{getInitials(myProfile.first_name,myProfile.last_name)}</span>
                    </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black text-white">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        
                        <DropdownMenuItem className="hover:cursor-pointer">
                            <form className="w-full" action={signOut}>
                                <Button className="bg-black hover:bg-transparent hover:text-black w-full">Logout</Button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div> : <div className="flex items-center mr-6">
                            <Link className="hover:text-2xl transition-all" href={'/auth?m=log-in'}>Log In</Link>
                            <span className="text-3xl text-[#3b3b3b]">/</span>
                            <Link className="hover:text-2xl transition-all" href={'auth?m=sign-up'}>Sign Up</Link>
                    </div>}
            
        </nav>
    )
}


export default Navbar;