import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest,res: NextResponse) {

    const businessId = req.nextUrl.searchParams.get('id')
    
    const supabase = createClient()
    const user = await supabase.auth.getUser()


    // check for user authenticated
    if(!user){
        redirect('/auth')
    }

    const id = user.data.user?.id
    
    let myProfile: any; 
    const profiles = await supabase.from('profiles').select().eq('id',id)
    if(profiles.data){
        myProfile = profiles.data![0]
    } // set corresponding profile data to auth user


    const {data,error} = await supabase.from('user_businesses').insert({
        business_id: businessId,
        user_id: id
    })

    if(error){
        redirect(`/business/${businessId}`)
    }


    redirect(`/business/${businessId}`)
}