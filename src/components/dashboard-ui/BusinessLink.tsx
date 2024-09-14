'use client'

import { createClient } from "@/utils/supabase/client"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"



export default function BusinessLink({businessId}: {businessId: string}){

    const [business,setBusiness] = useState<any| null>(null)
  
    const supabase = createClient()
  
    useEffect(() => {
    
      supabase.from('business').select().eq('id',businessId)
      .then((res) => {
        setBusiness(res.data && res.data[0])
      })
  
    },[])
  
    
    return <Link href={`/business/${businessId}`} className="text-center grow hover:cursor-pointer inline px-1 py-2">{business ? business.name : <LoaderCircle className="animate-spin text-center" />}</Link>
  }