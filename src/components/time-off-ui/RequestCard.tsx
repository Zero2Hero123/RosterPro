import { formatDate } from "date-fns";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import Approval from "./Approval";
import { Check, Clock } from "lucide-react";

import { Badge } from "../ui/badge";


interface Props {
    t: any // time off request
}


export default function RequestCard({t}: Props){
    

    return <>
    
        <Card className="pt-3 px-1 h-40" key={`TIME_OFF_${t.id}`}>
            {/* <CardTitle className="font-medium">{currUserProfile.data[0].first_name} {currUserProfile.data[0].last_name}</CardTitle> */}
            <CardContent>{formatDate(t.from,"MMMM dd, yyyy")} to {formatDate(t.to,"MMMM dd, yyyy")}</CardContent>
            <CardFooter className="flex justify-between">
                {t.approved ? <Badge variant={'outline'}><Check size={14}/>  Approved</Badge> : <Badge className="flex gap-1" variant={'secondary'}> <Clock size={14}/> Awaiting Approval</Badge>}
                <Approval requestId={t.id}/>
            </CardFooter>
        </Card>
    
    </>
}