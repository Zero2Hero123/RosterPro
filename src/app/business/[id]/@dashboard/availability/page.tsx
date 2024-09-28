import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



interface Props {
    params: {id: string}
}


export default async function Availability({ params }: Props){


    return <>
    
        <div>
            <Tabs defaultValue="sunday" className="dark">
                <TabsList>
                    <TabsTrigger value="sunday">Sunday</TabsTrigger>
                    <TabsTrigger value="monday">Monday</TabsTrigger>
                    <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
                    <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
                    <TabsTrigger value="thursday">Thursday</TabsTrigger>
                    <TabsTrigger value="friday">Friday</TabsTrigger>
                    <TabsTrigger value="saturday">Saturday</TabsTrigger>
                </TabsList>
                <TabsContent value="sunday">
                    <div className="flex justify-center gap-2">
                        <span>Available on Sundays? </span> <Switch/>
                    </div>

                    <div>
                        <span>From: </span>
                        <span>To: </span>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    
    
    </>

}