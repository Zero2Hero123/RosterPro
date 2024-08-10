'use server'
import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card"

interface Props {
    title: string;
    desc: string;
    href: string
}

const ServiceDisplayCard: React.FC<Props> = async ({title,desc,href}) => {


    return <>
    
        <Link href={href}>
            <Card className="hover:bg-gray-900 h-[200px]">
                <CardHeader className="font-bold">{title}</CardHeader>
                <CardContent >
                    <span className="text-sm text-gray-400">
                        {desc}
                    </span>
                </CardContent>
            </Card>
    
        </Link>
    
    </>
}

export default ServiceDisplayCard;