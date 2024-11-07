import ProfilePic from "@/components/ProfilePic";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";





interface Props {
    content: string;
    businessId: string;
    authorId: string;
    createdAt: Date;
    withPersonLabel?: boolean;
}



const Message = ({content,authorId, withPersonLabel = true}: Props) => {

    const supabase = createClient()

    const [user,setUser] = useState<User | null>(null) // current user logged in

    const [author,setAuthor] = useState<any>(null)

    useEffect(() => {
        supabase.from('profiles') // get the author of the current message
            .select()
            .eq('id',authorId)
            .then(res => {
                if(!res.error){
                    setAuthor(res.data[0])
                } else {
                    console.error(res.error.message)
                }
            })
    },[])

    useEffect(() => {
        supabase.auth.getUser()
            .then(res => setUser(res.data.user))
    },[])

    return <div className={`flex ${authorId == user?.id ? 'justify-end' : 'justify-start'}`}>

        <div className={`flex ${authorId == user?.id ? 'bg-black' : 'bg-gray-700'} text-white p-3 rounded-lg text-sm`}>
            {(withPersonLabel && author) && <ProfilePic firstName={author.first_name} lastName={author.last_name} size={10}/>}
            <div className="flex flex-col">
                {(withPersonLabel && author) && <span>{author.first_name} {author.last_name}</span>}
                <span>{content}</span>
            </div>
        </div>

    </div>
}


export default Message;