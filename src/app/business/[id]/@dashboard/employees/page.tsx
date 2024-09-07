import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { UserRoundPlus } from "lucide-react";
import { notFound } from "next/navigation";




interface Props {
    params: {id: string}
}


export default async function Employees({params}: Props){

    const supabase = createClient()

    const {data, error} = await supabase
    .rpc('getbusinessmembers', {
      businessqueryid: params.id
    })


    return (<>
    
        <Input className="bg-[#121212] w-[45%] min-w-[250px]" placeholder="Search by Name" type="search" />


        <Table className="dark">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map((e: any) => <TableRow key={'ROW_'+e.id}>
                    <TableCell>{e.first_name+' '+e.last_name}</TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    
    </>)
}