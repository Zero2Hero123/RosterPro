import generate, { GenerateResponse } from "@/utils/actions";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const props = await req.json()

    const { schedule } = await generate(props) as any

    console.log(schedule)

    return NextResponse.json(schedule)
}