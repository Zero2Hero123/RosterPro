'use server'
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Image from "next/image";

import logo from '@/../public/icon.png'
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { signOut } from "@/utils/actions";
import { Button } from "./ui/button";

function getInitials(firstName: string,lastName: string){

    return (firstName.substring(0,1) + lastName.substring(0,1)).toUpperCase()
}

const Navbar: React.FC = async () => {

    const client = createClient()
    const user = await client.auth.getUser()

    const id = user.data.user?.id
    
    const profiles = await client.from('profiles').select()
    const myProfile = profiles.data![0]


    return (
        <nav className="bg-black h-16 flex items-center mb-4 print:hidden justify-between">
            <Link href='/'><Image className="" src={logo} alt='logo' width={60} height={60} /></Link>
            <div></div>
            {myProfile && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="rounded-full bg-slate-800 p-3 hover:cursor-pointer mx-2">
                        <span className="font-medium text-xl">{myProfile && getInitials(myProfile.first_name,myProfile.last_name)}</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black text-white">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className="flex justify-center">
                        <Link className="text-center" href={"/dashboard"}>Dashboard</Link>
                    </DropdownMenuItem>
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