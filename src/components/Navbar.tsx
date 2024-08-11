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

const toolsAndServices = [
    {
        title: 'Person-Job Assigner',
        desc: "Dyanmically create schedules in which people's names map to assigned jobs.",
        href: '/dashboard/scheduler'
    }
]


function getInitials(firstName: string,lastName: string){

    return (firstName.substring(0,1) + lastName.substring(0,1)).toUpperCase()
}

const Navbar: React.FC = async () => {

    const client = createClient()
    const user = await client.auth.getUser()

    const id = user.data.user?.id
    
    let myProfile: any;

    const profiles = await client.from('profiles').select()
    if(profiles.data){
        myProfile = profiles.data![0]
    }

    const organizations = await client.from('organizations').select()
    
    let organization: any

    if(organizations.data){
        organization = organizations.data[0]
    }

    return (
        <nav className="bg-black h-16 flex items-center mb-4 print:hidden justify-between">

            <div className="flex">
                <Link href='/'><Image className="" src={logo} alt='logo' width={60} height={60} /></Link>
                <NavigationMenu>
                    <NavigationMenuItem className="dark bg-black text-black w-fit">
                        <NavigationMenuTrigger>Tools & Services</NavigationMenuTrigger>

                        <NavigationMenuContent className="bg-black text-white">
                            <div className="grid grid-cols-2 grid-rows-2 gap-3 w-[500px] h-[300px] p-6">
                                {toolsAndServices.map(t => <ServiceDisplayCard key={t.title} title={t.title} desc={t.desc} href={t.href} />)}
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenu>
            </div>

            {myProfile && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="rounded-full bg-slate-800 p-3 hover:cursor-pointer mx-2">
                        <span className="font-medium text-xl">{myProfile && getInitials(myProfile.first_name,myProfile.last_name)}</span>
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
            </DropdownMenu>}
            
        </nav>
    )
}


export default Navbar;