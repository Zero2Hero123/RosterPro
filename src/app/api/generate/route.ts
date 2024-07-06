import generate, { GenerateResponse } from "@/utils/actions";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse){
    const props = await req.json()

    const schedule = await generate(props)

    return NextResponse.json(schedule)
}