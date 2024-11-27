import RemoveUser from "@/components/RemoveUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast, useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/server";
import { UserRoundPlus, UserRoundX } from "lucide-react";
import { notFound } from "next/navigation";




interface Props {
    params: Promise<{id: string}>
}


export default async function Employees(props: Props) {
    const params = await props.params;

    const supabase = await createClient()

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
                    <TableCell className="flex items-center justify-between">
                        <span>{e.first_name+' '+e.last_name}</span>

                        <RemoveUser businessId={params.id} name={e.first_name+' '+e.last_name} userId={e.id}/>
                    </TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    
    </>)
}