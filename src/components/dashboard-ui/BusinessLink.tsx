'use client'

import { createClient } from "@/utils/supabase/client"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Props {
  businessId: string, 
  asLink?: boolean
}

export default function BusinessLink({businessId,asLink = true}: Props){

    const [business,setBusiness] = useState<any| null>(null)
  
    const supabase = createClient()
  
    useEffect(() => {
    
      supabase.from('business').select().eq('id',businessId)
      .then((res) => {
        if(res.error) console.error(res.error.message)
        setBusiness(res.data && res.data[0])
      })
  
    },[businessId])

    if(!asLink){
      return <span className="text-center grow hover:cursor-pointer inline px-1 py-2">{business ? business.name : <LoaderCircle className="animate-spin text-center" />}</span>
    }
  
    
    return <Link href={`/business/${businessId}`} className="text-center grow hover:cursor-pointer inline px-1 py-2">{business ? business.name : <LoaderCircle className="animate-spin text-center" />}</Link>
  }