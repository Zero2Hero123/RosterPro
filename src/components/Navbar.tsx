
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Image from "next/image";

import logo from '@/../public/icon.png'

const Navbar: React.FC = () => {


    return (
        <nav className="bg-black h-16 flex items-center mb-4">
            <Link href='/'><Image className="" src={logo} alt='logo' width={60} height={60} /></Link>
            <div></div>
        </nav>
    )
}


export default Navbar;