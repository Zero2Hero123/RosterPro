'use client'

import Message from "@/components/dashboard-ui/chat/Message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { sendMessage } from "@/utils/actions"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState, use } from "react";




interface Props {
    params: Promise<{id: string}>
}



export default function Chat(props: Props) {
    const params = use(props.params);

    const supabase = createClient()

    const [business,setBusiness] = useState<any | null>(null)

    const [user,setUser] = useState<User | null>(null)

    const [messages,setMessages] = useState<any[]>([])

    useEffect(() => {
        supabase.from('business').select().eq('id',params.id)
        .then(({data,error}) => {
            if(data){
                setBusiness(data[0])
            }

            console.log(data)

            if(error) console.warn(error)
        })


        supabase.auth.getUser()
            .then(u => setUser(u.data.user))
    },[])


    useEffect(() => {
        if(business){
            supabase.from('messages').select().eq('business_id',business.id)
            .then(res => {
                if(res.error) console.log(res.error)
                if(res.data){
                    setMessages(res.data)
                }

                console.log(res.data)
            })
        }
    },[business])



    function handleInserts(data: any){

        console.log(data.new)

        setMessages(prev => [...prev,data.new])

    }

    useEffect(() => {
        supabase
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleInserts)
        .subscribe()


        return () => {
            supabase.channel('messages').unsubscribe()
        }
    },[])

    useEffect(() => {
        console.log(messages)
    },[messages])


    // TODO add sendMessage server action
    return <>
    
        <header>
            {business ? <span className="text-3xl font-bold ">{business.name}</span> : <Skeleton className="h-[36px] w-[300px]" />}
        </header>
        <section className="bg-[#333333] h-[81vh] md:h-[85vh] w-[100%] flex flex-col">

            <div className="flex flex-col justify-end grow p-2">
                {
                    messages.map(m => 
                        <Message key={'MSG_'+m.authorId+m.id} businessId={m.business_id} authorId={m.authorId} content={m.content} createdAt={m.createdAt} />
                    )
                }
            </div>
            
            <form action={sendMessage} className="w-[100%] h-16 flex items-center p-2 gap-1" >
                <input className="hidden" name="author-id" defaultValue={user?.id ? user.id : ''} type="text" />
                <input className="hidden" name="business-id" defaultValue={business ? business.id : ''} type="text" />

                <Input min={2} autoFocus name="message-content" className="bg-black border-gray-600 text-white w-[100%] dark" placeholder="Type a message" type="text" />
                <Button className="bg-white text-black hover:bg-slate-300 hover:text-black h-10" type="submit">Send</Button>
            </form>
        </section>
    
    </>
}